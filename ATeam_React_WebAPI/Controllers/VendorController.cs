using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using ATeam_React_WebAPI.Interfaces;


namespace ATeam_React_WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
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


}