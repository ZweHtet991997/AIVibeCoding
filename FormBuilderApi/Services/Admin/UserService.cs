using FormBuilderApi.Entities;
using FormBuilderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FormBuilderApi.Services.Admin
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public UserService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
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
                    //Status = "Active" // You can add status logic based on your requirements
                    Status = u.Status
                })
                .ToListAsync();

            return users;
        }

        //Save user submitted response
        public async Task<bool> SubmitFormResponseAsync(SubmitFormRequestDto dto)
        {
            try
            {
                var formExists = await _context.FormTable.AnyAsync(f => f.FormId == dto.FormId);
                if (!formExists) return false;

                var isAssigned = await _context.FormAssignment.AnyAsync(fa => fa.FormId == dto.FormId && fa.UserId == dto.UserId);
                if (!isAssigned) return false;

                string? filePath = null;
                if (dto.ResponseFile != null && dto.ResponseFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = $"{Guid.NewGuid()}_{dto.ResponseFile.FileName}";
                    filePath = Path.Combine("uploads", uniqueFileName);
                    var fullPath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await dto.ResponseFile.CopyToAsync(stream);
                    }
                }

                var formResponse = new FormResponse
                {
                    FormId = dto.FormId,
                    UserId = dto.UserId,
                    ResponseData = dto.ResponseData,
                    IsSpam = dto.IsSpam,
                    FilePath = filePath,
                    ResponseDate = DateConvertService.GetCurrentMyanmarDateTime()
                };

                _context.FormResponse.Add(formResponse);
                await _context.SaveChangesAsync();

                // Send email to all admin users
                var adminInfo = await _context.UserTable
                    .Where(u => u.UserId == dto.AssignedBy).FirstOrDefaultAsync();

                var user = await _context.UserTable.FirstOrDefaultAsync(u => u.UserId == dto.UserId);
                var form = await _context.FormTable.FirstOrDefaultAsync(f => f.FormId == dto.FormId);

                if (user != null && form != null)
                {
                    await _emailService.SendFormSubmittedEmailAsync(
                            adminInfo.Email,
                            adminInfo.UserName,
                            user.UserName,
                            user.Email,
                            form.FormName
                        );
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        //User Assigned Form List
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
                            AssignedBy = assignment.AssignedBy,
                            AssignedDate = assignment.AssignedAt,
                            SubmissionStatus = _context.FormResponse
                                .Any(r => r.FormId == form.FormId && r.UserId == userId) ? "Complete" : "Pending"
                        };

            return await query.ToListAsync();
        }

        //User Assigned Form Details
        public async Task<UserAssignedFormDetailsDto?> GetUserAssignedFormDetailsAsync(UserAssignedFormRequestModel model)
        {
            var assignment = await _context.FormAssignment
                .Where(a => a.UserId == model.UserId && a.FormId == model.FormId)
                .FirstOrDefaultAsync();

            if (assignment == null)
                return null;

            var form = await _context.FormTable
                .Where(f => f.FormId == model.FormId)
                .FirstOrDefaultAsync();

            if (form == null)
                return null;

            return new UserAssignedFormDetailsDto
            {
                FormId = form.FormId,
                FormName = form.FormName,
                Description = form.Description ?? string.Empty,
                FormSchema = form.FormSchema
            };
        }

        //Get User Submitted Responses
        //public async Task<List<UserSubmittedResponsesDto>> GetUserSubmittedResponsesAsync(int userId)
        //{
        //    var query = from response in _context.FormResponse
        //                join form in _context.FormTable on response.FormId equals form.FormId
        //                // Left join to get approval status and comments
        //                join approval in _context.FormResponseApproval
        //                    on response.ResponseId equals approval.ResponseId into approvalGroup
        //                from approval in approvalGroup.DefaultIfEmpty()
        //                where response.UserId == userId
        //                orderby response.ResponseDate descending
        //                select new UserSubmittedResponsesDto
        //                {
        //                    ResponseId = response.ResponseId,
        //                    FormName = form.FormName,
        //                    ResponseValue = response.ResponseValue,
        //                    ResponseDate = response.ResponseDate,
        //                    ApprovalStatus = approval != null ? approval.Status : "Pending",
        //                    AdminComment = approval != null ? approval.Comment : null,
        //                    DecisionDate = approval != null ? approval.DecisionDate : null
        //                };

        //    return await query.ToListAsync();
        //}
    }
}
