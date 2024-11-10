using ATeam_React_WebAPI.Models;
using ATeam_React_WebAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ATeam_React_WebAPI.Data;

public static class DbSeeder
{
    public static async Task SeedData(
        IServiceProvider serviceProvider,
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();
        // await context.Database.MigrateAsync();

        await SeedRoles(roleManager);
        await SeedAdmin(userManager);
        await SeedCategories(context);
    }

    private static async Task SeedAdmin(UserManager<IdentityUser> userManager)
    {
        const string adminEmail = "admin@foodapp.com";
        const string adminPassword = "Admin123!";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

        if (existingAdmin == null)
        {
            var admin = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail
            };

            var result = await userManager.CreateAsync(admin, adminPassword);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create admin user: {string.Join(", ", result.Errors)}");
            }

            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }

    private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        string[] roleNames = { "Admin", "Vendor" };

        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }
    }

    private static async Task SeedCategories(ApplicationDbContext context)
    {
        if (!context.FoodCategories.Any())
        {
            var categories = new[]
            {
                "Grønnsaker, frukt, bær og nøtter",
                "Mel, gryn og ris",
                "Grøt, brød og pasta",
                "Melk, syrnede melkeprodukter og vegetabilske alternativer",
                "Ost og vegetabilske alternativer",
                "Matfett og oljer",
                "Fisk, skalldyr og produkter av disse",
                "Kjøtt, pålegg, pølser etc.",
                "Vegetabilske produkter",
                "Ferdigretter",
                "Dressinger og sauser"
            };

            var now = DateTime.UtcNow;
            var categoryEntities = categories.Select(name => new FoodCategory
            {
                CategoryName = name,
                CreatedAt = now,
                UpdatedAt = now
            });

            await context.FoodCategories.AddRangeAsync(categoryEntities);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedTestVendor(UserManager<IdentityUser> userManager)
    {
        // Create test vendor (user with role Vendor) if it doesn't exist
        const string vendorEmail = "vendor@foodapp.com";
        const string vendorPassword = "Vendor123!";

        var existingVendor = await userManager.FindByEmailAsync(vendorEmail);

        if (existingVendor == null)
        {
            var vendor = new IdentityUser
            {
                UserName = vendorEmail,
                Email = vendorEmail
            };

            var result = await userManager.CreateAsync(vendor, vendorPassword);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create vendor user: {string.Join(", ", result.Errors)}");
            }

            await userManager.AddToRoleAsync(vendor, "Vendor");
        }
    }

    public static async Task SeedTestVendorWithTestProducts(
        UserManager<IdentityUser> userManager,
        ApplicationDbContext context)
    {
        await SeedTestVendor(userManager);

        var vendor = await userManager.FindByEmailAsync("vendor@foodapp.com");

        // Create test products for the test vendor if they don't exist
        var vendorId = vendor?.Id;

        var existingProducts = await context.FoodProducts
            .Where(p => p.CreatedById == vendorId)
            .ToListAsync();

        if (vendorId != null && existingProducts.Count == 0)
        {
            var products = new[]
            {
                new FoodProduct
                {
                    ProductName = "Grandiosa",
                    EnergyKcal = 40,
                    Protein = 12,
                    Carbohydrates = 17,
                    Fat = 11,
                    Fiber = 14,
                    Salt = 6,
                    NokkelhullQualified = NutritionCalculatorService.IsNokkelhullQualified(40, 12, 17, 11, 14, 6),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedById = vendorId,
                    FoodCategoryId = 10
                },
                new FoodProduct
                {
                    ProductName = "Spaghetti",
                    EnergyKcal = 32,
                    Protein = 8,
                    Carbohydrates = 22,
                    Fat = 5,
                    Fiber = 3,
                    Salt = 1,
                    NokkelhullQualified = NutritionCalculatorService.IsNokkelhullQualified(32, 8, 22, 5, 3, 1),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedById = vendorId,
                    FoodCategoryId = 3
                },
                // This should be nokkelhull qualified
                new FoodProduct
                {
                    ProductName = "Knekkebrød",
                    EnergyKcal = 30,
                    Protein = 10,
                    Carbohydrates = 32,
                    Fat = 2,
                    Fiber = 7,
                    Salt = 1,
                    NokkelhullQualified = NutritionCalculatorService.IsNokkelhullQualified(30, 10, 32, 2, 7, 1),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    CreatedById = vendorId,
                    FoodCategoryId = 3
                },
            };

            await context.FoodProducts.AddRangeAsync(products);
        }

        await context.SaveChangesAsync();
    }
}