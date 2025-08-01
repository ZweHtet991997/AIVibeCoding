using FormBuilderApi.Models;
using FormBuilderApi.Services.Admin;
using FormBuilderApi.Services.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilderApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/v1/admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly IUserService _userService;

        public AdminDashboardController(IDashboardService dashboardService, IUserService userService)
        {
            _dashboardService = dashboardService;
            _userService = userService;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<AdminDashboardDto>> GetDashboard()
        {
            var metrics = await _dashboardService.GetAdminDashboardMetricsAsync();
            return Ok(metrics);
        }

        [HttpGet("userlist")]
        public async Task<IActionResult> GetNormalUsers()
        {
            try
            {
                var users = await _userService.GetNormalUsersWithFormCountsAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching users", error = ex.Message });
            }
        }

        //[HttpGet("topresponse")]
        //public async Task<IActionResult> GetTop5FormResponses()
        //{
        //    var responses = await _dashboardService.GetTop5FormResponsesAsync();
        //    return Ok(responses);
        //}
    }
}
