using FormBuilderApi.Entities;
using FormBuilderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FormBuilderApi.Services.Admin
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserListDto>> GetNormalUsersWithFormCountsAsync()
        {
            var users = await _context.UserTable
                .Where(u => u.Role == "Normal User")
                .Select(u => new UserListDto
                {
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    Role = u.Role,
                    TotalAssignedForms = _context.FormAssignment
                        .Where(fa => fa.UserId == u.UserId)
                        .Count(),
                    Status = "Active" // You can add status logic based on your requirements
                })
                .ToListAsync();

            return users;
        }

        public async Task<List<UserAssignedFormsDto>> GetUserAssignedFormsAsync(int userId)
        {
            var query = from assignment in _context.FormAssignment
                        join form in _context.FormTable on assignment.FormId equals form.FormId
                        where assignment.UserId == userId
                        orderby assignment.AssignedAt descending
                        select new UserAssignedFormsDto
                        {
                            FormId = form.FormId,
                            FormName = form.FormName,
                            Description = form.Description,
                            Url = $"/forms/{form.FormId}", // You can customize this URL format
                            AssignedDate = assignment.AssignedAt,
                            SubmissionStatus = _context.FormResponse
                                .Any(r => r.FormId == form.FormId && r.UserId == userId) ? "Submitted" : "Not Submitted"
                        };

            return await query.ToListAsync();
        }

        public async Task<List<UserSubmittedResponsesDto>> GetUserSubmittedResponsesAsync(int userId)
        {
            var query = from response in _context.FormResponse
                        join form in _context.FormTable on response.FormId equals form.FormId
                        // Left join to get approval status and comments
                        join approval in _context.FormResponseApproval
                            on response.ResponseId equals approval.ResponseId into approvalGroup
                        from approval in approvalGroup.DefaultIfEmpty()
                        where response.UserId == userId
                        orderby response.ResponseDate descending
                        select new UserSubmittedResponsesDto
                        {
                            ResponseId = response.ResponseId,
                            FormName = form.FormName,
                            ResponseValue = response.ResponseValue,
                            ResponseDate = response.ResponseDate,
                            ApprovalStatus = approval != null ? approval.Status : "Pending",
                            AdminComment = approval != null ? approval.Comment : null,
                            DecisionDate = approval != null ? approval.DecisionDate : null
                        };

            return await query.ToListAsync();
        }
    }
}
