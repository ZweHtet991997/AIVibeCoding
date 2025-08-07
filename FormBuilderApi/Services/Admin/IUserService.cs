using FormBuilderApi.Models;

namespace FormBuilderApi.Services.Admin
{
    public interface IUserService
    {
        Task<List<UserListDto>> GetNormalUsersWithFormCountsAsync();
        Task<bool> SubmitFormResponseAsync(SubmitFormResponseDto dto);
        Task<List<UserAssignedFormsDto>> GetUserAssignedFormsAsync(int userId);
        Task<UserAssignedFormDetailsDto?> GetUserAssignedFormDetailsAsync(UserAssignedFormRequestModel model);
        //Task<List<UserSubmittedResponsesDto>> GetUserSubmittedResponsesAsync(int userId);
    }
}