using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ATeam_React_WebAPI.Interfaces;
using ATeam_React_WebAPI.DTOs.Common;
using ATeam_React_WebAPI.DTOs.Products;
using ATeam_React_WebAPI.Models;




namespace ATeam_React_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
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
      FoodCategoryId = fp.FoodCategoryId,
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

    // ======= UPDATE ======
  // PUT : api/admin/{id}
  [HttpPut("{id}")]
  public async Task<ActionResult<FoodProductDTO>> UpdateProduct(int id, [FromBody] FoodProductCreateUpdateDTO updateDto)
  {
    // Validate modle:
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    try
    {
      // Check Product Exists, Ownership and Id and get product
      var existingProduct = await _foodProductRepository.GetFoodProductAsync(id);

      // Update the existing product with new values
      existingProduct.ProductName = updateDto.ProductName;
      existingProduct.EnergyKcal = updateDto.EnergyKcal;
      existingProduct.Fat = updateDto.Fat;
      existingProduct.Carbohydrates = updateDto.Carbohydrates;
      existingProduct.Protein = updateDto.Protein;
      existingProduct.Fiber = updateDto.Fiber;
      existingProduct.Salt = updateDto.Salt;
      existingProduct.FoodCategoryId = updateDto.FoodCategoryId;
      existingProduct.UpdatedAt = DateTime.UtcNow;

      // Save updates 
      var updatedProduct = await _foodProductRepository.UpdateFoodProductAsync(existingProduct);

      // Map to DTO
      var resultDto = new FoodProductDTO
      {
        ProductId = updatedProduct.FoodProductId,
        ProductName = updatedProduct.ProductName,
        EnergyKcal = updatedProduct.EnergyKcal,
        Fat = updatedProduct.Fat,
        Carbohydrates = updatedProduct.Carbohydrates,
        Protein = updatedProduct.Protein,
        Fiber = updatedProduct.Fiber,
        Salt = updatedProduct.Salt,
        NokkelhullQualified = updatedProduct.NokkelhullQualified,
        CategoryName = updatedProduct.FoodCategory?.CategoryName ?? "Unknown",
        CreatedByUsername = updatedProduct.CreatedBy?.UserName ?? "Unknown"
      };

      return Ok(resultDto);
    }
    catch (UnauthorizedAccessException)
    {
      return Unauthorized();
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
