// Configuration/IdentityConfig.cs

using ATeam_React_WebAPI.Data;
using Microsoft.AspNetCore.Identity;

namespace ATeam_React_WebAPI.Configuration;

public static class IdentityConfig
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IWebHostEnvironment env)
    {
        services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                // Disable all confirmation and lockout
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedPhoneNumber = false;

                // Simplify password requirements
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;

                // Disable lockout
                options.Lockout.AllowedForNewUsers = false;
                options.Lockout.MaxFailedAccessAttempts = 1000;
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.Zero;

                // User settings
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders()
            .AddApiEndpoints();

        // Configure cookie settings
        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.HttpOnly = true;
            options.Cookie.Path = "/";
            options.Cookie.Domain = null; // Let the browser decide
            options.Cookie.SecurePolicy = env.IsDevelopment()
                ? CookieSecurePolicy.None
                : CookieSecurePolicy.Always;
            options.Cookie.SameSite = env.IsDevelopment()
                ? SameSiteMode.Lax
                : SameSiteMode.None;

            // Set cookie expiration
            options.ExpireTimeSpan = TimeSpan.FromDays(1);
            options.SlidingExpiration = true;

            // These paths should match your frontend routes
            options.LoginPath = "/login";
            options.AccessDeniedPath = "/unauthorized";
            options.LogoutPath = "/logout";

            // Handle unauthorized API requests
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };

            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        return services;
    }
}