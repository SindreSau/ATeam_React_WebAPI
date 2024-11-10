using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ATeam_React_WebAPI.Interfaces;
using ATeam_React_WebAPI.DTOs.Common;
using ATeam_React_WebAPI.DTOs.Products;
using ATeam_React_WebAPI.Models;




namespace ATeam_React_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
//[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
  private readonly IFoodProductRepository _foodProductRepository;

  public AdminController(IFoodProductRepository foodProductRepository)
  {
    _foodProductRepository = foodProductRepository;
  }

  // mini helper method
  private async Task<FoodProduct> CheckProduct(int productId)
  {
    var product = await _foodProductRepository.GetFoodProductAsync(productId);

    if (product == null)
    {
      throw new KeyNotFoundException($"Product with Id: {productId} not found");
    }

    return product;
  }

  // ==== GET ALL =====
  // GET : api/admin
  [HttpGet]
  public async Task<ActionResult<PaginatedResponse<FoodProductDTO>>> GetProducts(
    [FromQuery] PaginationParameters parameters,
    [FromQuery] string searchTerm = "")
  {
    var products = await _foodProductRepository.GetFoodProductsAsync(
      parameters.PageNumber,
      parameters.PageSize,
      parameters.OrderBy,
      parameters.Nokkelhull,
      searchTerm);

    // Get total count for pagination
    var totalCount = await _foodProductRepository.GetFoodProductsCountAsync(
      searchTerm,
      parameters.Nokkelhull
    );

    // If none
    if (!products.Any())
    {
      return Ok(new PaginatedResponse<FoodProductDTO>
      {
        Items = new List<FoodProductDTO>(),
        PageNumber = parameters.PageNumber,
        PageSize = parameters.PageSize,
        TotalCount = 0
      });
    }

    // map to DTO
    var productDtos = products.Select(fp => new FoodProductDTO
    {
      ProductId = fp.FoodProductId,
      ProductName = fp.ProductName,
      EnergyKcal = fp.EnergyKcal,
      Fat = fp.Fat,
      Carbohydrates = fp.Carbohydrates,
      Protein = fp.Protein,
      Fiber = fp.Fiber,
      Salt = fp.Salt,
      NokkelhullQualified = fp.NokkelhullQualified,
      CategoryName = fp.FoodCategory?.CategoryName ?? "Unknown",
      CreatedByUsername = fp.CreatedBy?.UserName ?? "Unknown"
    }).ToList();

    var response = new PaginatedResponse<FoodProductDTO>
    {
      Items = productDtos,
      PageNumber = parameters.PageNumber,
      PageSize = parameters.PageSize,
      TotalCount = totalCount
    };

    return Ok(response);
  }

  // ===== GET ONE ====
  // GET : api/admin/{id}
  [HttpGet("{id}")]
  public async Task<ActionResult<FoodProductDTO>> GetProduct(int id)
  {
    try
    {
      var product = await CheckProduct(id);

      var productDto = new FoodProductDTO
      {
        ProductId = product.FoodProductId,
        ProductName = product.ProductName,
        EnergyKcal = product.EnergyKcal,
        Fat = product.Fat,
        Carbohydrates = product.Carbohydrates,
        Protein = product.Protein,
        Fiber = product.Fiber,
        Salt = product.Salt,
        NokkelhullQualified = product.NokkelhullQualified,
        CategoryName = product.FoodCategory?.CategoryName ?? "Unknown",
        CreatedByUsername = product.CreatedBy?.UserName ?? "Unknown"
      };

      return Ok(productDto);
    }
    catch (KeyNotFoundException)
    {
      return NotFound();
    }
  }

  // ==== DELETE ===
  // DELETE : api/admin/{id}
  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteProduct(int id)
  {
    try
    {

      var product = await CheckProduct(id);

      await _foodProductRepository.DeleteFoodProductAsync(id);
      return NoContent();
    }
    catch (KeyNotFoundException)
    {
      return NotFound();
    }
  }
}
