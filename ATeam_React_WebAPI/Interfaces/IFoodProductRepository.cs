using ATeam_React_WebAPI.Models;

namespace ATeam_React_WebAPI.Interfaces;

public interface IFoodProductRepository
{
    // get all food products with pagination and sorting, and filtering by nokkelhull
    Task<IEnumerable<FoodProduct>> GetFoodProductsAsync(int pageNumber, int pageSize, string orderBy, bool? nokkelhull, string searchTerm = "");

    // get all food products by vendor with pagination and sorting, and filtering by nokkelhull
    Task<IEnumerable<FoodProduct>> GetFoodProductsByVendorAsync(string vendorId, int pageNumber, int pageSize, string orderBy, bool? nokkelhull);

    // get the count of food products by vendor
    Task<int> GetFoodProductsByVendorCountAsync(string vendorId);

    // get count of all food products
    Task<int> GetFoodProductsCountAsync(string searchTerm, bool? nokkelhull);

    // get a food product by id
    Task<FoodProduct> GetFoodProductAsync(int id);

    // add a food product
    Task<FoodProduct> AddFoodProductAsync(FoodProduct foodProduct);

    // update a food product
    Task<FoodProduct> UpdateFoodProductAsync(FoodProduct foodProduct);

    // delete a food product
    Task<bool> DeleteFoodProductAsync(int id);

}