using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using ATeam_React_WebAPI.Interfaces;
using ATeam_React_WebAPI.DTOs.Common;
using ATeam_React_WebAPI.DTOs.Products;
using ATeam_React_WebAPI.Models;



namespace ATeam_React_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Vendor")]
public class VendorController : ControllerBase
{
  private readonly IFoodProductRepository _foodProductRepository;
  private readonly IFoodCategoryRepository _foodCategoryRepository;
  private readonly UserManager<IdentityUser> _userManager;

  // Constructor
  public VendorController(
        IFoodProductRepository foodProductRepository,
        IFoodCategoryRepository foodCategoryRepository,
        UserManager<IdentityUser> userManager)
  {
    _foodProductRepository = foodProductRepository;
    _foodCategoryRepository = foodCategoryRepository;
    _userManager = userManager;
  }

  // Helper methods (GetUserId and VerifyOwnership)
  // Get user's id:
  private string GetUserId()
  {
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
    {
      throw new UnauthorizedAccessException("User is not authenticated");
    }
    return userId;
  }

  // Verify ownership:
  private async Task<FoodProduct> VerifyProductOwnership(int productId)
  {
    var product = await _foodProductRepository.GetFoodProductAsync(productId);
    if (product == null)
    {
      throw new KeyNotFoundException($"Product with ID {productId} not found");
    }

    var userId = GetUserId();
    if (product.CreatedById != userId)
    {
      throw new UnauthorizedAccessException("User does not own this product");
    }

    return product;
  }

  // ======== Index/GetAll ========
  // GET : api/vendor
  // Returns paginated list of food products
  [HttpGet]
  public async Task<ActionResult<PaginatedResponse<FoodProductDTO>>> GetProducts([FromQuery] PaginationParameters parameters, [FromQuery] string searchTerm = "")
  {
    try
    {
      // Get current userId:
      var userId = GetUserId();

      // return products from repository using pagination parameters
      var products = await _foodProductRepository.GetFoodProductsByVendorAsync(
        userId,
        parameters.PageNumber,
        parameters.PageSize,
        parameters.OrderBy,
        parameters.Nokkelhull,
        searchTerm);

      // Get total count for pagination:
      var totalCount = await _foodProductRepository.GetFoodProductsByVendorCountAsync(userId);

      // Map model to DTO
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
        CreatedByUsername = fp.CreatedBy?.UserName ?? "Unknown",
        FoodCategoryId = fp.FoodCategoryId
      }).ToList();

      // Created Paginated Response for return
      var response = new PaginatedResponse<FoodProductDTO>
      {
        Items = productDtos,
        PageNumber = parameters.PageNumber,
        PageSize = parameters.PageSize,
        TotalCount = totalCount
      };

      return Ok(response);
    }
    catch (UnauthorizedAccessException)
    {
      return Unauthorized();
    }
  }


  // ======== GET ONE =======
  // GET : api/vendor/{id}
  [HttpGet("{id}")]
  public async Task<ActionResult<FoodProductDTO>> GetProduct(int id)
  {
    try
    {
      // Get the product by Id and verify ownership
      var product = await VerifyProductOwnership(id);

      // Map to DTO
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

      // Return 200 OK with ProductDto
      return Ok(productDto);

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

  // ======== CREATE ========
  // POST : api/vendor
  // Create a new food product
  [HttpPost]
  public async Task<ActionResult<FoodProductDTO>> CreateProduct([FromBody] FoodProductCreateUpdateDTO createDto)
  {
    // Validate model state
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    try
    {
      // Get userId 
      var userId = GetUserId();

      // Map DTO to the model
      var product = new FoodProduct
      {
        ProductName = createDto.ProductName,
        EnergyKcal = createDto.EnergyKcal,
        Fat = createDto.Fat,
        Carbohydrates = createDto.Carbohydrates,
        Protein = createDto.Protein,
        Fiber = createDto.Fiber,
        Salt = createDto.Salt,
        FoodCategoryId = createDto.FoodCategoryId,
        CreatedById = userId,
        CreatedAt = DateTime.UtcNow
      };

      // Add to db:
      var createdProduct = await _foodProductRepository.AddFoodProductAsync(product);

      // Map result: 
      var resultDto = new FoodProductDTO
      {
        ProductId = createdProduct.FoodProductId,
        ProductName = createdProduct.ProductName,
        EnergyKcal = createdProduct.EnergyKcal,
        Fat = createdProduct.Fat,
        Carbohydrates = createdProduct.Carbohydrates,
        Protein = createdProduct.Protein,
        Fiber = createdProduct.Fiber,
        Salt = createdProduct.Salt,
        NokkelhullQualified = createdProduct.NokkelhullQualified,
        CategoryName = createdProduct.FoodCategory?.CategoryName ?? "Unknown",
        CreatedByUsername = createdProduct.CreatedBy?.UserName ?? "Unknown"
      };

      // Return 201 Created Response with the created product
      return CreatedAtAction(
        nameof(GetProducts), // Name of the GET action
        new { id = createdProduct.FoodProductId },
        resultDto
      );
    }
    catch (UnauthorizedAccessException)
    {
      return Unauthorized();
    }
  }

  // ======= UPDATE ======
  // PUT : api/vendor/{id}
  [HttpPut("{id}")]
  public async Task<ActionResult<FoodProductDTO>> UpdateProduct(int id, [FromBody] FoodProductCreateUpdateDTO updateDto)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    try
    {
      var existingProduct = await VerifyProductOwnership(id);

      // Update using the validated DTO data
      existingProduct.ProductName = updateDto.ProductName;
      existingProduct.EnergyKcal = updateDto.EnergyKcal;
      existingProduct.Fat = updateDto.Fat;
      existingProduct.Carbohydrates = updateDto.Carbohydrates;
      existingProduct.Protein = updateDto.Protein;
      existingProduct.Fiber = updateDto.Fiber;
      existingProduct.Salt = updateDto.Salt;
      existingProduct.FoodCategoryId = updateDto.FoodCategoryId;
      existingProduct.UpdatedAt = DateTime.UtcNow;

      var updatedProduct = await _foodProductRepository.UpdateFoodProductAsync(existingProduct);

      // Map back to response DTO
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
        FoodCategoryId = updatedProduct.FoodCategoryId,
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

  // ===== DELETE =====
  // DELETE : api/vendor/{id}
  [HttpDelete("{id}")]
  public async Task<ActionResult> DeleteProduct(int id)
  {
    try
    {
      await VerifyProductOwnership(id);
      await _foodProductRepository.DeleteFoodProductAsync(id);
      return NoContent();
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
}