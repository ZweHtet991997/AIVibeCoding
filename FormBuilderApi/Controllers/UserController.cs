using FormBuilderApi.Models;
using FormBuilderApi.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilderApi.Controllers
{
    [Authorize(Roles = "Normal User")]
    [Route("api/v1/user")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("submitresponse")]
        public async Task<IActionResult> SubmitFormResponse([FromForm] SubmitFormRequestDto dto)
        {
            var result = await _userService.SubmitFormResponseAsync(dto);
            if (!result)
                return BadRequest("Submission failed. Check form assignment or file upload.");
            return Ok("Form response submitted successfully.");
        }

        [HttpGet("assigned")]
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

        [HttpPost("form-details")]
        public async Task<ActionResult<UserAssignedFormDetailsDto>> GetAssignedFormDetails([FromBody] UserAssignedFormRequestModel model)
        {
            var result = await _userService.GetUserAssignedFormDetailsAsync(model);
            if (result == null)
                return NotFound("User is not assigned to this form or form does not exist.");

            return Ok(result);
        }

        //[HttpGet("submitted")]
        //public async Task<IActionResult> GetUserSubmittedResponses(int userId)
        //{
        //    try
        //    {
        //        var responses = await _userService.GetUserSubmittedResponsesAsync(userId);
        //        return Ok(responses);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}
    }
}
