using ATeam_React_WebAPI.Data;
using ATeam_React_WebAPI.Interfaces;
using ATeam_React_WebAPI.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ATeam_React_WebAPI.Configuration;

public static class DatabaseConfig
{
    public static IServiceCollection AddDatabaseServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IFoodProductRepository, FoodProductRepository>();
        services.AddScoped<IFoodCategoryRepository, FoodCategoryRepository>();

        return services;
    }
}