using FormBuilderApi.Entities;
using FormBuilderApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace FormBuilderApi.Services.Admin
{
    public class FormService : IFormService
    {
        private readonly AppDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public FormService(AppDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = new HttpClient();
            _emailService = emailService;
        }

        //Create Form
        public async Task<FormTable> CreateFormAsync(CreateFormRequestDto dto)
        {
            // Only duplicate validation for form name (case-insensitive)
            var existingForm = await _context.FormTable
                .FirstOrDefaultAsync(f => f.FormName.ToLower() == dto.FormName.ToLower());

            if (existingForm != null)
            {
                throw new InvalidOperationException($"A form with the name '{dto.FormName}' already exists.");
            }

            // Create and save the form
            var form = new FormTable
            {
                FormName = dto.FormName,
                FormSchema = dto.FormSchema,
                CreatedDate = DateConvertService.GetCurrentMyanmarDateTime(),
                Status = "Draft", // default status
                FormUrl = dto.FormUrl
            };

            _context.FormTable.Add(form);
            await _context.SaveChangesAsync();

            return form;
        }

        //Update Forma Status
        public async Task<bool> ActivateFormAsync(int formId)
        {
            try
            {
                var form = await _context.FormTable.FindAsync(formId);

                if (form == null)
                {
                    return false; // Form not found
                }

                // Only allow Draft to Active transition
                if (form.Status != "Draft")
                {
                    return false; // Form is not in Draft status
                }

                form.Status = "Active";
                await _context.SaveChangesAsync();
                return true; // Success
            }
            catch
            {
                return false; // Error occurred
            }
        }

        //Form Submit Count List
        public async Task<List<FormListDto>> GetFormsWithSubmissionCountsAsync()
        {
            var forms = await _context.FormTable
                .Select(f => new FormListDto
                {
                    FormId = f.FormId,
                    FormName = f.FormName,
                    Status = f.Status,
                    CreatedDate = f.CreatedDate,
                    TotalSubmissions = _context.FormResponse
                        .Where(fr => fr.FormId == f.FormId)
                        .Select(fr => fr.ResponseId)
                        .Distinct()
                        .Count()
                })
                .ToListAsync();

            return forms;
        }

        //Assigned Form List

        public async Task<List<FormAssignmentListDto>> GetUsersAssignedToFormAsync(int formId)
        {
            var assignments = await _context.FormAssignment
                .Where(fa => fa.FormId == formId)
                .Join(_context.UserTable,
                    assignment => assignment.UserId,
                    user => user.UserId,
                    (assignment, user) => new FormAssignmentListDto
                    {
                        AssignmentId = assignment.AssignmentId,
                        FormId = assignment.FormId,
                        UserId = assignment.UserId,
                        UserName = user.UserName,
                        Email = user.Email,
                        Role = user.Role,
                        AssignedAt = assignment.AssignedAt
                    })
                .ToListAsync();

            return assignments;
        }

        //Assg Form to User
        public async Task<FormAssignment> AssignFormAsync(FormAssignmentRequestDto dto)
        {
            // Optional: Check if assignment already exists
            var exists = _context.FormAssignment.Any(a => a.FormId == dto.FormId && a.UserId == dto.UserId);
            if (exists)
                throw new InvalidOperationException("This form is already assigned to the user.");

            var assignment = new FormAssignment
            {
                FormId = dto.FormId,
                UserId = dto.UserId,
                AssignedBy = dto.AssignedBy,//current logined user Id (Admin role)
                AssignedAt = DateConvertService.GetCurrentMyanmarDateTime()
            };

            _context.FormAssignment.Add(assignment);
            await _context.SaveChangesAsync();

            // Fetch user and form details for email
            var user = await _context.UserTable.FirstOrDefaultAsync(u => u.UserId == dto.UserId);
            var form = await _context.FormTable.FirstOrDefaultAsync(f => f.FormId == dto.FormId);

            if (user != null && form != null)
            {
                var formUrl = form.FormUrl ?? $"/forms/{form.FormId}";
                await _emailService.SendFormAssignedEmailAsync(user.Email, user.UserName, form.FormName, formUrl);
            }

            return assignment;
        }

        // Remove Form Assignment
        public async Task<bool> RemoveAssignmentAsync(int formId, int userId)
        {
            var assignment = await _context.FormAssignment
                .FirstOrDefaultAsync(a => a.FormId == formId && a.UserId == userId);

            if (assignment == null)
                return false; // Or throw an exception if you prefer

            _context.FormAssignment.Remove(assignment);
            await _context.SaveChangesAsync();
            return true;
        }

        // Approve or Reject Form Response
        public async Task<FormResponseApproval> ApproveOrRejectAsync(FormResponseApprovalRequestDto dto)
        {
            try
            {
                // Optional: Check if already approved/rejected
                var existing = await _context.FormResponseApproval
                    .FirstOrDefaultAsync(a => a.ResponseId == dto.ResponseId);

                if (existing != null)
                {
                    // Update existing approval
                    existing.Status = dto.Status;
                    existing.Comment = dto.Comment;
                    existing.ApprovedBy = dto.ApprovedBy;
                    existing.DecisionDate = DateTime.UtcNow;
                }
                else
                {
                    // Create new approval record
                    existing = new FormResponseApproval
                    {
                        ResponseId = dto.ResponseId,
                        Status = dto.Status,
                        Comment = dto.Comment,
                        ApprovedBy = dto.ApprovedBy,
                        DecisionDate = DateConvertService.GetCurrentMyanmarDateTime()
                    };
                    _context.FormResponseApproval.Add(existing);
                }

                await _context.SaveChangesAsync();

                // Fetch user and form details for email
                var response = await _context.FormResponse.FirstOrDefaultAsync(r => r.ResponseId == dto.ResponseId);
                if (response != null)
                {
                    var user = await _context.UserTable.FirstOrDefaultAsync(u => u.UserId == response.UserId);
                    var form = await _context.FormTable.FirstOrDefaultAsync(f => f.FormId == response.FormId);
                    var admin = await _context.UserTable.FirstOrDefaultAsync(u => u.UserId == dto.ApprovedBy);

                    if (user != null && form != null && admin != null)
                    {
                        bool isApproved = dto.Status == "Approved";
                        await _emailService.SendFormApprovalEmailAsync(
                            user.Email,
                            user.UserName,
                            admin.UserName,
                            form.FormName,
                            dto.Comment,
                            isApproved
                        );
                    }
                }
                return existing;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Get All Responses with Status
        public async Task<List<FormResponseListItemDto>> GetAllResponsesWithStatusAsync(bool isSpam)
        {
            var query = from response in _context.FormResponse
                        join user in _context.UserTable on response.UserId equals user.UserId
                        join form in _context.FormTable on response.FormId equals form.FormId
                        // Left join to approval (may be null = Pending)
                        join approval in _context.FormResponseApproval
                            on response.ResponseId equals approval.ResponseId into approvalGroup
                        from approval in approvalGroup.DefaultIfEmpty()
                        where response.IsSpam == isSpam
                        select new FormResponseListItemDto
                        {
                            ResponseId = response.ResponseId,
                            FormId = form.FormId,
                            FormName = form.FormName,
                            UserId = user.UserId,
                            UserName = user.UserName,
                            UserEmail = user.Email,
                            Description = form.Description,
                            ResponseData = response.ResponseData,
                            FilePath = response.FilePath,
                            ResponseDate = response.ResponseDate,
                            Status = approval != null ? approval.Status : "Pending",
                            Comment = approval != null ? approval.Comment : null,
                            DecisionDate = approval != null ? approval.DecisionDate : null
                        };

            return await query.ToListAsync();
        }
    }
}
