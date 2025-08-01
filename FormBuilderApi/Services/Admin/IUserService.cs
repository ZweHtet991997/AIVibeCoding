using FormBuilderApi.Models;

namespace FormBuilderApi.Services.Admin
{
    public interface IUserService
    {
        Task<List<UserListDto>> GetNormalUsersWithFormCountsAsync();
        Task<List<UserAssignedFormsDto>> GetUserAssignedFormsAsync(int userId);
        Task<List<UserSubmittedResponsesDto>> GetUserSubmittedResponsesAsync(int userId);
    }
}