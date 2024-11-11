using Microsoft.AspNetCore.Mvc;

namespace ATeam_React_WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHealthStatus()
    {
        return Ok(new { status = "Healthy" });
    }
}