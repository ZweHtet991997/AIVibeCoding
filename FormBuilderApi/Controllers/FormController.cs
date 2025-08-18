using FormBuilderApi.Models;
using FormBuilderApi.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FormBuilderApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/v1/form")] // <- Added versioning here
    public class FormController : ControllerBase
    {
        private readonly IFormService _formService;

        public FormController(IFormService formService)
        {
            _formService = formService;
        }

        [HttpPost("createform")]
        public async Task<IActionResult> CreateForm([FromBody] CreateFormRequestDto dto)
        {
            try
            {
                var createdForm = await _formService.CreateFormAsync(dto);

                return Ok(createdForm);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the form." });
            }
        }

        [HttpPatch("activate")]
        public async Task<IActionResult> ActivateForm(int formId)
        {
            var result = await _formService.ActivateFormAsync(formId);

            if (result)
            {
                return Ok(new { message = "Form activated successfully." });
            }
            else
            {
                return BadRequest(new { message = "Form activation failed. Form may not exist or not in Draft status." });
            }
        }

        [HttpGet("formlist")]
        public async Task<IActionResult> GetForms()
        {
            try
            {
                var forms = await _formService.GetFormsWithSubmissionCountsAsync();
                return Ok(forms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching forms", error = ex.Message });
            }
        }

        [HttpGet("{formId}/assignments")]
        public async Task<IActionResult> GetUsersAssignedToForm(int formId)
        {
            try
            {
                var formDetails = await _formService.GetUsersAssignedToFormAsync(formId);
                if (formDetails == null)
                {
                    return NotFound(new { message = "Form not found" });
                }

                return Ok(formDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching form details", error = ex.Message });
            }
        }

        //[HttpPost("approve-reject")]
        //public async Task<IActionResult> ApproveOrReject([FromBody] FormResponseApprovalRequestDto dto)
        //{
        //    if (dto.Status != "Approved" && dto.Status != "Rejected")
        //        return BadRequest(new { message = "Status must be 'Approved' or 'Rejected'." });

        //    var result = await _formService.ApproveOrRejectAsync(dto);
        //    return Ok(result);
        //}

        [HttpPost("approval")]
        public async Task<IActionResult> ApproveOrReject([FromBody] FormResponseApprovalRequestDto dto)
        {
            if (dto.Status != "Approved" && dto.Status != "Rejected")
                return BadRequest(new { message = "Status must be 'Approved' or 'Rejected'." });

            var result = await _formService.ApproveOrRejectAsync(dto);
            return Ok(result);
        }

        [HttpGet("formresponse")]
        public async Task<IActionResult> GetAllResponses(bool isSpam)
        {
            var list = await _formService.GetAllResponsesWithStatusAsync(isSpam);
            return Ok(list);
        }

        [HttpPost("assignform")]
        public async Task<IActionResult> AssignForm([FromBody] FormAssignmentRequestDto dto)
        {
            try
            {
                var assignment = await _formService.AssignFormAsync(dto);
                return Ok(assignment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("removeassign")]
        public async Task<IActionResult> RemoveAssignment([FromQuery] int formId, [FromQuery] int userId)
        {
            var result = await _formService.RemoveAssignmentAsync(formId, userId);
            if (!result)
                return NotFound(new { message = "Assignment not found." });

            return NoContent();
        }
    }

}
