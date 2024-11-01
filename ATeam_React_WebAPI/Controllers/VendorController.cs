using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using ATeam_React_WebAPI.Interfaces;
using ATeam_React_WebAPI.DTOs.Common;
using ATeam_React_WebAPI.DTOs.Products;



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

  // ======== Index ========
  // GET : api/vendor
  // Returns paginated list of food products
  [HttpGet]
  public async Task<ActionResult<PaginatedResponse<FoodProductDTO>>> GetProducts([FromQuery] PaginationParameters parameters)
  {
    // Get current userId:
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
    {
      return Unauthorized();
    }

    // return products from repository using pagination parameters
    var products = await _foodProductRepository.GetFoodProductsByVendorAsync(
      userId,
      parameters.PageNumber,
      parameters.PageSize,
      parameters.OrderBy,
      parameters.Nokkelhull);

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

  // ======== CREATE ========
  // POST : api/vendor
  // Create a new food product
  // [HttpPost]


}