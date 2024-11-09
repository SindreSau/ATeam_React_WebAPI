using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ATeam_React_WebAPI.DTOs.Account;

namespace ATeam_React_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ErrorResponse { Error = "Invalid request model" });
        }

        var user = new IdentityUser { UserName = request.Email, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (result.Succeeded)
        {
            var roleResult = await _userManager.AddToRoleAsync(user, "Vendor");

            if (!roleResult.Succeeded)
            {
                _logger.LogError("Failed to add Vendor role to user {Email}", request.Email);
                await _userManager.DeleteAsync(user);
                return StatusCode(500, new ErrorResponse { Error = "Failed to assign user role" });
            }

            _logger.LogInformation("User {Email} registered successfully as Vendor", request.Email);
            return Ok(new RegisterResponse { Email = request.Email });
        }

        return BadRequest(new ErrorResponse { Error = string.Join(", ", result.Errors.Select(e => e.Description)) });
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _signInManager.PasswordSignInAsync(
            request.Email,
            request.Password,
            isPersistent: true,
            lockoutOnFailure: true);

        if (result.Succeeded)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            var roles = await _userManager.GetRolesAsync(user);

            _logger.LogInformation("User {Email} logged in successfully", request.Email);
            return Ok(new LoginResponse
            {
                Email = user.Email,
                Role = roles.FirstOrDefault() ?? "Vendor"
            });
        }

        if (result.IsLockedOut)
        {
            _logger.LogWarning("User {Email} account locked out", request.Email);
            return BadRequest(new ErrorResponse { Error = "Account is locked out" });
        }

        _logger.LogWarning("Invalid login attempt for user {Email}", request.Email);
        return BadRequest(new ErrorResponse { Error = "Invalid login attempt" });
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out");
        return Ok();
    }

    [HttpGet("info")]
    [Authorize]
    [ProducesResponseType(typeof(UserInfoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserInfo()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound(new ErrorResponse { Error = "User not found" });
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new UserInfoResponse
        {
            Email = user.Email!,
            Role = roles.FirstOrDefault() ?? "Vendor"
        });
    }
}