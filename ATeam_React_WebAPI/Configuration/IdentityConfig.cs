using ATeam_React_WebAPI.Data;
using Microsoft.AspNetCore.Identity;

namespace ATeam_React_WebAPI.Configuration;

public static class IdentityConfig
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services)
    {
        services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.ConfigureApplicationCookie(options =>
        {
            options.LoginPath = "/Identity/Account/Login";
            options.LogoutPath = "/Identity/Account/Logout";
            options.AccessDeniedPath = "/Identity/Account/AccessDenied";
            options.ExpireTimeSpan = TimeSpan.FromDays(30);
            options.Cookie.HttpOnly = true;
            options.SlidingExpiration = false;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
            options.Cookie.MaxAge = TimeSpan.FromDays(30);
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.Redirect("/Identity/Account/Login");
                return Task.CompletedTask;
            };
        });

        return services;
    }
}