using FormBuilderApi.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilderApi.Controllers
{
    [Authorize(Roles ="Normal User")]
    [Route("api/v1/user")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("assigned/{userId}")]
        public async Task<IActionResult> GetUserAssignedForms(int userId)
        {
            try
            {
                var assignedForms = await _userService.GetUserAssignedFormsAsync(userId);
                return Ok(assignedForms);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("submitted/{userId}")]
        public async Task<IActionResult> GetUserSubmittedResponses(int userId)
        {
            try
            {
                var responses = await _userService.GetUserSubmittedResponsesAsync(userId);
                return Ok(responses);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
