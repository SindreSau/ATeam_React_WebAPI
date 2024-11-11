using ATeam_React_WebAPI.Models;
using ATeam_React_WebAPI.Data;
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

        // Ensure database is created and migrations are applied
        await context.Database.EnsureCreatedAsync();
        await context.Database.MigrateAsync();

        await SeedRoles(roleManager);
        await SeedAdmin(userManager);
        await SeedCategories(context);
        await SeedTestVendorsWithProducts(userManager, context);
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



    public static async Task SeedTestVendorsWithProducts(
    UserManager<IdentityUser> userManager,
    ApplicationDbContext context)
    {
        // Additional test vendors
        var vendorCredentials = new[]
        {
        ("vendor@foodapp.com", "Vendor123!"),
        ("tine@foodapp.com", "Tine123!"),
        ("nortura@foodapp.com", "Nortura123!"),
        ("orkla@foodapp.com", "Orkla123!")
    };

        foreach (var (email, password) in vendorCredentials)
        {
            var existingVendor = await userManager.FindByEmailAsync(email);

            if (existingVendor == null)
            {
                var vendor = new IdentityUser
                {
                    UserName = email,
                    Email = email
                };

                var result = await userManager.CreateAsync(vendor, password);
                if (!result.Succeeded)
                {
                    throw new Exception($"Failed to create vendor user: {string.Join(", ", result.Errors)}");
                }

                await userManager.AddToRoleAsync(vendor, "Vendor");
            }
        }

        // Create products for each vendor
        foreach (var (email, _) in vendorCredentials)
        {
            var vendor = await userManager.FindByEmailAsync(email);
            var vendorId = vendor?.Id;

            if (vendorId == null) continue;

            var existingProducts = await context.FoodProducts
                .Where(p => p.CreatedById == vendorId)
                .ToListAsync();

            if (existingProducts.Count == 0)
            {
                var products = new List<FoodProduct>();

                if (email == "vendor@foodapp.com")
                {
                    products.AddRange(new[]{
                    new FoodProduct
                            {
                                ProductName = "Fullkornspasta",
                                EnergyKcal = 350,
                                Protein = 12,
                                Carbohydrates = 70,
                                Fat = 2,
                                Fiber = 8,
                                Salt = 0,
                                NokkelhullQualified = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 3 // Pasta category
                            },
                            new FoodProduct
                            {
                                ProductName = "Økologisk Havregryn",
                                EnergyKcal = 370,
                                Protein = 14,
                                Carbohydrates = 65,
                                Fat = 7,
                                Fiber = 10,
                                Salt = 0,
                                NokkelhullQualified = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 2 // Gryn category
                            },
                            new FoodProduct
                            {
                                ProductName = "Røkt Laks",
                                EnergyKcal = 220,
                                Protein = 25,
                                Carbohydrates = 0,
                                Fat = 13,
                                Fiber = 0,
                                Salt = 2,
                                NokkelhullQualified = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 7 // Fish category
                            },
                            new FoodProduct
                            {
                                ProductName = "Gresk Yoghurt",
                                EnergyKcal = 120,
                                Protein = 10,
                                Carbohydrates = 4,
                                Fat = 8,
                                Fiber = 0,
                                Salt = 0,
                                NokkelhullQualified = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 4 // Dairy category
                            },
                            new FoodProduct
                            {
                                ProductName = "Hummus",
                                EnergyKcal = 180,
                                Protein = 8,
                                Carbohydrates = 15,
                                Fat = 12,
                                Fiber = 6,
                                Salt = 1,
                                NokkelhullQualified = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 9 // Vegetable products
                            },
                            new FoodProduct
                            {
                                ProductName = "Pesto",
                                EnergyKcal = 290,
                                Protein = 5,
                                Carbohydrates = 3,
                                Fat = 28,
                                Fiber = 2,
                                Salt = 2,
                                NokkelhullQualified = false,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 11 // Sauces category
                            },
                            new FoodProduct
                            {
                                ProductName = "Fersk Pizza Margherita",
                                EnergyKcal = 240,
                                Protein = 12,
                                Carbohydrates = 30,
                                Fat = 8,
                                Fiber = 2,
                                Salt = 1,
                                NokkelhullQualified = false,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 10 // Ready meals
                            },
                            new FoodProduct
                            {
                                ProductName = "Økologisk Quinoa",
                                EnergyKcal = 340,
                                Protein = 14,
                                Carbohydrates = 60,
                                Fat = 6,
                                Fiber = 7,
                                Salt = 0,
                                NokkelhullQualified = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 2 // Grains category
                            },
                            new FoodProduct
                            {
                                ProductName = "Vegetarburger",
                                EnergyKcal = 220,
                                Protein = 15,
                                Carbohydrates = 20,
                                Fat = 10,
                                Fiber = 5,
                                Salt = 1,
                                NokkelhullQualified = true,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 9 // Vegetable products
                            },
                            new FoodProduct
                            {
                                ProductName = "Olivenolje Extra Virgin",
                                EnergyKcal = 880,
                                Protein = 0,
                                Carbohydrates = 0,
                                Fat = 100,
                                Fiber = 0,
                                Salt = 0,
                                NokkelhullQualified = false,
                                CreatedAt = DateTime.UtcNow,
                                UpdatedAt = DateTime.UtcNow,
                                CreatedById = vendorId,
                                FoodCategoryId = 6 // Oils category
                            }
                    }
                    );
                }
                else if (email == "tine@foodapp.com")
                {
                    products.AddRange(new[]{
                    new FoodProduct
                    {
                        ProductName = "Q Melk Lett",
                        EnergyKcal = 38,
                        Protein = 4,
                        Carbohydrates = 5,
                        Fat = 1,
                        Fiber = 0,
                        Salt = 0,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 4 // Melk category
                    },
                    new FoodProduct
                    {
                        ProductName = "Norvegia Ost",
                        EnergyKcal = 350,
                        Protein = 27,
                        Carbohydrates = 0,
                        Fat = 27,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 5 // Ost category
                    },
                    new FoodProduct
                    {
                        ProductName = "Piano Yoghurt Naturell",
                        EnergyKcal = 58,
                        Protein = 4,
                        Carbohydrates = 6,
                        Fat = 3,
                        Fiber = 0,
                        Salt = 0,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 4
                    },
                    new FoodProduct
                    {
                        ProductName = "Kulturmjølk",
                        EnergyKcal = 62,
                        Protein = 3,
                        Carbohydrates = 4,
                        Fat = 4,
                        Fiber = 0,
                        Salt = 0,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 4
                    },
                    new FoodProduct
                    {
                        ProductName = "Jarlsberg Ost",
                        EnergyKcal = 380,
                        Protein = 27,
                        Carbohydrates = 0,
                        Fat = 29,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 5
                    },
                    new FoodProduct
                    {
                        ProductName = "Go'morgen Yoghurt Jordbær",
                        EnergyKcal = 126,
                        Protein = 5,
                        Carbohydrates = 18,
                        Fat = 4,
                        Fiber = 1,
                        Salt = 0,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 4
                    },
                    new FoodProduct
                    {
                        ProductName = "Skyr Vanilje",
                        EnergyKcal = 64,
                        Protein = 11,
                        Carbohydrates = 4,
                        Fat = 0,
                        Fiber = 0,
                        Salt = 0,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 4
                    },
                    new FoodProduct
                    {
                        ProductName = "Cottage Cheese",
                        EnergyKcal = 103,
                        Protein = 13,
                        Carbohydrates = 3,
                        Fat = 4,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 5
                    },
                    new FoodProduct
                    {
                        ProductName = "Sjokolademelk",
                        EnergyKcal = 77,
                        Protein = 3,
                        Carbohydrates = 12,
                        Fat = 2,
                        Fiber = 1,
                        Salt = 0,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 4
                    },
                    new FoodProduct
                    {
                        ProductName = "Brunost",
                        EnergyKcal = 440,
                        Protein = 9,
                        Carbohydrates = 45,
                        Fat = 29,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 5
                    }
                });
                }
                else if (email == "nortura@foodapp.com")
                {
                    products.AddRange(new[]
                    {
                    new FoodProduct
                    {
                        ProductName = "Prior Kyllingfilet",
                        EnergyKcal = 105,
                        Protein = 23,
                        Carbohydrates = 0,
                        Fat = 2,
                        Fiber = 0,
                        Salt = 0,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Gilde Kjøttdeig",
                        EnergyKcal = 250,
                        Protein = 20,
                        Carbohydrates = 0,
                        Fat = 17,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Prior Kyllingpølser",
                        EnergyKcal = 240,
                        Protein = 13,
                        Carbohydrates = 3,
                        Fat = 20,
                        Fiber = 0,
                        Salt = 2,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Gilde Bacon",
                        EnergyKcal = 380,
                        Protein = 13,
                        Carbohydrates = 0,
                        Fat = 37,
                        Fiber = 0,
                        Salt = 3,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Prior Kalkunkjøttdeig",
                        EnergyKcal = 145,
                        Protein = 20,
                        Carbohydrates = 0,
                        Fat = 8,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Gilde Leverpostei",
                        EnergyKcal = 220,
                        Protein = 11,
                        Carbohydrates = 12,
                        Fat = 15,
                        Fiber = 0,
                        Salt = 2,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Prior Kyllinglår",
                        EnergyKcal = 185,
                        Protein = 18,
                        Carbohydrates = 0,
                        Fat = 13,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Gilde Svinekoteletter",
                        EnergyKcal = 225,
                        Protein = 21,
                        Carbohydrates = 0,
                        Fat = 16,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Prior Kyllingwienerpølser",
                        EnergyKcal = 220,
                        Protein = 12,
                        Carbohydrates = 2,
                        Fat = 19,
                        Fiber = 0,
                        Salt = 2,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "Gilde Servelat",
                        EnergyKcal = 270,
                        Protein = 11,
                        Carbohydrates = 3,
                        Fat = 24,
                        Fiber = 0,
                        Salt = 2,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    }
                });
                }
                else if (email == "orkla@foodapp.com")
                {
                    products.AddRange(new[]
                        {
                    new FoodProduct
                    {
                        ProductName = "Stabburet Makrell i Tomat",
                        EnergyKcal = 220,
                        Protein = 18,
                        Carbohydrates = 9,
                        Fat = 14,
                        Fiber = 0,
                        Salt = 1,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 7
                    },
                    new FoodProduct
                    {
                        ProductName = "TORO Tomatsuppe",
                        EnergyKcal = 42,
                        Protein = 2,
                        Carbohydrates = 8,
                        Fat = 1,
                        Fiber = 1,
                        Salt = 1,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 10
                    },
                    new FoodProduct
                    {
                        ProductName = "Idun Ketchup",
                        EnergyKcal = 112,
                        Protein = 1,
                        Carbohydrates = 26,
                        Fat = 0,
                        Fiber = 1,
                        Salt = 2,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 11
                    },
                    new FoodProduct
                    {
                        ProductName = "TORO Brun Saus",
                        EnergyKcal = 45,
                        Protein = 1,
                        Carbohydrates = 9,
                        Fat = 1,
                        Fiber = 1,
                        Salt = 1,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 11
                    },
                    new FoodProduct
                    {
                        ProductName = "Stabburet Leverpostei",
                        EnergyKcal = 230,
                        Protein = 9,
                        Carbohydrates = 13,
                        Fat = 17,
                        Fiber = 0,
                        Salt = 2,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 8
                    },
                    new FoodProduct
                    {
                        ProductName = "TORO Kremet Blomkålsuppe",
                        EnergyKcal = 55,
                        Protein = 2,
                        Carbohydrates = 9,
                        Fat = 2,
                        Fiber = 1,
                        Salt = 1,
                        NokkelhullQualified = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 10
                    },
                    new FoodProduct
                    {
                        ProductName = "Fun Light Appelsin",
                        EnergyKcal = 5,
                        Protein = 0,
                        Carbohydrates = 1,
                        Fat = 0,
                        Fiber = 0,
                        Salt = 0,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 1
                    },
                    new FoodProduct
                    {
                        ProductName = "Nora Syltetøy Jordbær",
                        EnergyKcal = 160,
                        Protein = 0,
                        Carbohydrates = 40,
                        Fat = 0,
                        Fiber = 1,
                        Salt = 0,
                        NokkelhullQualified = false,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        CreatedById = vendorId,
                        FoodCategoryId = 1
                    }
            });
                }
                if (products.Any())
                {
                    await context.FoodProducts.AddRangeAsync(products);
                }
            }
        }

        await context.SaveChangesAsync();
    }
}