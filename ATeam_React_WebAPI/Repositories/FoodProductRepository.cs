using ATeam_React_WebAPI.Data;
using ATeam_React_WebAPI.Interfaces;
using ATeam_React_WebAPI.Models;
using ATeam_React_WebAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace ATeam_React_WebAPI.Repositories
{
    // Repository class for managing food products
    public class FoodProductRepository : IFoodProductRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FoodProductRepository> _logger;
        private readonly IFoodSearchService _searchService;

        // Constructor that initializes the repository with the application database context
        public FoodProductRepository(ApplicationDbContext context, ILogger<FoodProductRepository> logger, IFoodSearchService searchService)
        {
            _context = context;
            _logger = logger;
            _searchService = searchService;
        }

        // Asynchronously retrieves a paginated list of food products based on filter and sort criteria
        public async Task<IEnumerable<FoodProduct>> GetFoodProductsAsync(int pageNumber, int pageSize, string orderBy, bool? nokkelhull, string searchTerm = "")
        {
            _logger.LogInformation("Getting food products with parameters: PageNumber={PageNumber}, PageSize={PageSize}, OrderBy={OrderBy}, Nokkelhull={Nokkelhull}, SearchTerm={SearchTerm}",
                pageNumber, pageSize, orderBy, nokkelhull, searchTerm);

            // Create a queryable collection of food products
            var query = _context.FoodProducts
                .Include(fp => fp.FoodCategory)
                .Include(fp => fp.CreatedBy)
                .AsQueryable();

            // Apply Nokkelhull filter if specified
            if (nokkelhull != null)
            {
                _logger.LogInformation("Applying Nokkelhull filter: {Nokkelhull}", nokkelhull);
                query = query.Where(fp => fp.NokkelhullQualified == nokkelhull);
            }

            // Get the base data
            var products = await query.ToListAsync();

            // If we have a search term, apply search and use its ordering
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                _logger.LogInformation("Applying fuzzy search for term: {SearchTerm}", searchTerm);
                products = _searchService.Search(products, searchTerm).ToList();
            }
            // If no search term, apply the regular ordering
            else
            {
                products = orderBy?.ToLower() switch
                {
                    "productname" => products.OrderBy(p => p.ProductName).ToList(),
                    "productname_desc" => products.OrderByDescending(p => p.ProductName).ToList(),
                    "category" => products.OrderBy(p => p.FoodCategory?.CategoryName).ThenBy(p => p.ProductName).ToList(),
                    "category_desc" => products.OrderByDescending(p => p.FoodCategory?.CategoryName).ThenBy(p => p.ProductName).ToList(),
                    _ => products.OrderBy(p => p.FoodProductId).ToList()
                };
            }

            // Apply pagination
            return products
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        // Get paginated food products by vendor ID with filter and sort criteria
        public async Task<IEnumerable<FoodProduct>> GetFoodProductsByVendorAsync(string vendorId, int pageNumber, int pageSize, string orderBy, bool? nokkelhull, string? search)
        {
            // Create a queryable collection of food products
            var query = _context.FoodProducts
                .Include(fp => fp.FoodCategory)
                .Include(fp => fp.CreatedBy)
                .Where(fp => fp.CreatedById == vendorId) // Filter by vendor ID
                .AsQueryable();

            // Filter products based on whether they are Nokkelhull qualified
            if (nokkelhull != null)
            {
                query = query.Where(fp => fp.NokkelhullQualified == nokkelhull);
            }

            // Get the filtered data
            var products = await query.ToListAsync();

            // If we have a search term, apply search and use its ordering
            if (!string.IsNullOrWhiteSpace(search))
            {
                _logger.LogInformation("Applying fuzzy search for term: {SearchTerm}", search);
                products = _searchService.Search(products, search).ToList();
            }
            // If no search term, apply the regular ordering
            else
            {
                products = orderBy?.ToLower() switch
                {
                    "productname" => products.OrderBy(p => p.ProductName).ToList(),
                    "productname_desc" => products.OrderByDescending(p => p.ProductName).ToList(),
                    "category" => products.OrderBy(p => p.FoodCategory?.CategoryName).ToList(),
                    "category_desc" => products.OrderByDescending(p => p.FoodCategory?.CategoryName).ToList(),
                    "energy" => products.OrderBy(p => p.EnergyKcal).ToList(),
                    "energy_desc" => products.OrderByDescending(p => p.EnergyKcal).ToList(),
                    "createdat" => products.OrderBy(p => p.CreatedAt).ToList(),
                    "createdat_desc" => products.OrderByDescending(p => p.CreatedAt).ToList(),
                    _ => products.OrderBy(p => p.FoodProductId).ToList()
                };
            }

            // Apply pagination
            return products
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }

        // Get the count of food products by vendor
        public async Task<int> GetFoodProductsByVendorCountAsync(string vendorId)
        {
            // Count the number of food products by the specified vendor
            return await _context.FoodProducts
                .Where(fp => fp.CreatedById == vendorId)
                .CountAsync();
        }

        public async Task<int> GetFoodProductsCountAsync(string searchTerm = "", bool? nokkelhull = null)
        {
            var query = _context.FoodProducts.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(p =>
                    (EF.Functions.Like(p.ProductName.ToLower(), $"%{searchTerm}%")) ||
                    (p.FoodCategory != null &&
                     EF.Functions.Like(p.FoodCategory.CategoryName.ToLower(), $"%{searchTerm}%")) ||
                    (p.CreatedBy != null && p.CreatedBy.UserName != null &&
                     EF.Functions.Like(p.CreatedBy.UserName.ToLower(), $"%{searchTerm}%"))
                );
            }

            if (nokkelhull.HasValue)
            {
                query = query.Where(p => p.NokkelhullQualified == nokkelhull.Value);
            }

            return await query.CountAsync();
        }

        // Asynchronously retrieves a specific food product by its ID
        public async Task<FoodProduct> GetFoodProductAsync(int id)
        {
            // Find and return the food product by ID
            var foodProduct = await _context.FoodProducts.FindAsync(id);
            return foodProduct ?? throw new KeyNotFoundException($"FoodProduct with ID {id} not found.");
        }

        // Asynchronously adds a new food product to the database
        public async Task<FoodProduct> AddFoodProductAsync(FoodProduct foodProduct)
        {
            if (foodProduct == null)
            {
                throw new ArgumentNullException(nameof(foodProduct));
            }

            // Calculate Nokkelhull qualification before saving
            foodProduct.NokkelhullQualified = NutritionCalculatorService.IsNokkelhullQualified(
                (float)foodProduct.EnergyKcal,
                (float)foodProduct.Protein,
                (float)foodProduct.Carbohydrates,
                (float)foodProduct.Fat,
                (float)foodProduct.Fiber,
                (float)foodProduct.Salt
            );

            _context.Add(foodProduct);
            await _context.SaveChangesAsync();
            return foodProduct;
        }

        // Asynchronously updates an existing food product in the database
        public async Task<FoodProduct> UpdateFoodProductAsync(FoodProduct foodProduct)
        {
            var existingFoodProduct = await _context.FoodProducts
                .Include(fp => fp.FoodCategory)
                .Include(fp => fp.CreatedBy)
                .FirstOrDefaultAsync(fp => fp.FoodProductId == foodProduct.FoodProductId);

            if (existingFoodProduct == null)
            {
                throw new KeyNotFoundException(
                    $"FoodProduct with ID {foodProduct.FoodProductId} not found. Could not update.");
            }

            // Update all properties
            existingFoodProduct.ProductName = foodProduct.ProductName;
            existingFoodProduct.EnergyKcal = foodProduct.EnergyKcal;
            existingFoodProduct.Fat = foodProduct.Fat;
            existingFoodProduct.Carbohydrates = foodProduct.Carbohydrates;
            existingFoodProduct.Protein = foodProduct.Protein;
            existingFoodProduct.Fiber = foodProduct.Fiber;
            existingFoodProduct.Salt = foodProduct.Salt;
            existingFoodProduct.FoodCategoryId = foodProduct.FoodCategoryId;
            existingFoodProduct.NokkelhullQualified = NutritionCalculatorService.IsNokkelhullQualified(
                (float)foodProduct.EnergyKcal,
                (float)foodProduct.Protein,
                (float)foodProduct.Carbohydrates,
                (float)foodProduct.Fat,
                (float)foodProduct.Fiber,
                (float)foodProduct.Salt
            );
            existingFoodProduct.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingFoodProduct;
        }

        // Asynchronously deletes a food product by its ID
        public async Task<bool> DeleteFoodProductAsync(int id)
        {
            // Find the food product by ID
            var foodProduct = await _context.FoodProducts.FindAsync(id);

            // If the product does not exist, return false
            if (foodProduct == null)
            {
                return false;
            }

            // Remove the product from the context
            _context.FoodProducts.Remove(foodProduct);
            // Save changes to the database
            await _context.SaveChangesAsync();
            return true; // Return true indicating successful deletion
        }
    }
}