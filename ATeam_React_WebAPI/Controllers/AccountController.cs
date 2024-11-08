using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ATeam_React_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        UserManager<IdentityUser> userManager,
        ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public record CustomRegisterRequest(string Email, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CustomRegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new IdentityUser { UserName = request.Email, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (result.Succeeded)
        {
            var roleResult = await _userManager.AddToRoleAsync(user, "Vendor");

            if (!roleResult.Succeeded)
            {
                _logger.LogError("Failed to add Vendor role to user {Email}", request.Email);
                // If role assignment fails, delete the user and return error
                await _userManager.DeleteAsync(user);
                return StatusCode(500, "Failed to assign user role");
            }

            _logger.LogInformation("User {Email} registered successfully as Vendor", request.Email);
            return Ok(new { message = "Registration successful" });
        }

        return BadRequest(result.Errors);
    }

    [HttpGet("info")]
    [Authorize]
    public async Task<IActionResult> GetUserInfo()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return NotFound();
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            Email = user.Email,
            IsEmailConfirmed = user.EmailConfirmed,
            Role = roles.FirstOrDefault()
        });
    }
}