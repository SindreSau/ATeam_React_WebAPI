// DTOs/Account/AccountDTO.cs
namespace ATeam_React_WebAPI.DTOs.Account;

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Email, string Password);

public record LoginResponse
{
    public string Message { get; init; } = "Login successful";
    public string Email { get; init; } = default!;
    public string Role { get; init; } = default!;
}

public record RegisterResponse
{
    public string Message { get; init; } = "Registration successful";
    public string Email { get; init; } = default!;
    public string Role { get; init; } = "Vendor";
}

public record UserInfoResponse
{
    public string Email { get; init; } = default!;
    public string Role { get; init; } = default!;
}

public record ErrorResponse
{
    public string Error { get; init; } = default!;
}