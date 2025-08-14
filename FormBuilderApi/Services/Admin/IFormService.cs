using FormBuilderApi.Entities;
using FormBuilderApi.Models;

namespace FormBuilderApi.Services.Admin
{
    public interface IFormService
    {
        Task<FormTable> CreateFormAsync(CreateFormRequestDto dto);
        Task<bool> ActivateFormAsync(int formId);
        Task<FormResponseApproval> ApproveOrRejectAsync(FormResponseApprovalRequestDto dto);
        Task<FormAssignment> AssignFormAsync(FormAssignmentRequestDto dto);
        Task<List<FormResponseListItemDto>> GetAllResponsesWithStatusAsync(bool isSpam);
        Task<List<FormListDto>> GetFormsWithSubmissionCountsAsync();
        Task<List<FormAssignmentListDto>> GetUsersAssignedToFormAsync(int formId);
        Task<bool> RemoveAssignmentAsync(int formId, int userId);
    }
}