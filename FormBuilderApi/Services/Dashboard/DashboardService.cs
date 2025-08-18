using FormBuilderApi.Entities;
using FormBuilderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FormBuilderApi.Services.Dashboard
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardDto> GetAdminDashboardMetricsAsync()
        {
            try
            {
                // Total forms created
                var totalFormsCreated = _context.FormTable.Count();

                // Total submissions received
                var totalSubmissionsReceived = _context.FormResponse.Count();

                // Approval status counts
                var totalPending = _context.FormResponse.Count(fr => !_context.FormResponseApproval.Any(fra => fra.ResponseId == fr.ResponseId));
                var totalApproved = _context.FormResponseApproval.Count(a => a.Status == "Approved");
                var totalRejected = _context.FormResponseApproval.Count(a => a.Status == "Rejected");

                var totalResponses = totalPending + totalApproved + totalRejected;

                // Calculate percentages (avoid division by zero)
                int percentApproved = totalResponses > 0 ? (int)Math.Round(totalApproved * 100.0 / totalResponses, 0) : 0;
                int percentPending = totalResponses > 0 ? (int)Math.Round(totalPending * 100.0 / totalResponses, 0) : 0;
                int percentRejected = totalResponses > 0 ? (int)Math.Round(totalRejected * 100.0 / totalResponses, 0) : 0;

                //top 5 form responses
                var topFormResponses = await GetTop5FormResponsesAsync();

                // Get bar chart data
                var barChartData = await GetBarChartDataAsync();

                var dto = new AdminDashboardDto
                {
                    TotalFormsCreated = totalFormsCreated,
                    TotalSubmissionsReceived = totalSubmissionsReceived,
                    TotalPendingApprovals = totalPending,
                    TotalApproved = totalApproved,
                    TotalRejected = totalRejected,
                    ApprovalStatusBreakdown = new ApprovalStatusBreakdownDto
                    {
                        Approved = new StatusDetail { Count = totalApproved, Percentage = percentApproved },
                        Pending = new StatusDetail { Count = totalPending, Percentage = percentPending },
                        Rejected = new StatusDetail { Count = totalRejected, Percentage = percentRejected }
                    },
                    BarChartData = barChartData,
                    TopFormResponses = topFormResponses
                };

                return await Task.FromResult(dto);
            }
            catch (Exception ex)
            {
                // Log the exception here if you have logging configured
                throw new InvalidOperationException("An error occurred while retrieving dashboard metrics.", ex);
            }
        }

        // Private method with proper error handling
        private async Task<List<BarChartDataDto>> GetBarChartDataAsync()
        {
            try
            {
                var result = new List<BarChartDataDto>();

                // Get all forms
                var forms = await _context.FormTable.Where(f => f.Status == "Active").ToListAsync();

                foreach (var form in forms)
                {
                    try
                    {
                        // Count total assignments for this form (handle null case)
                        var totalAssigned = await _context.FormAssignment
                            .Where(fa => fa.FormId == form.FormId)
                            .CountAsync();

                        // Count submitted responses for this form (handle null case)
                        var submitted = await _context.FormResponse
                            .Where(fr => fr.FormId == form.FormId)
                            .CountAsync();

                        // Calculate not submitted (ensure non-negative)
                        var notSubmitted = Math.Max(0, totalAssigned - submitted);

                        result.Add(new BarChartDataDto
                        {
                            FormName = form.FormName ?? "Unknown Form", // Handle null form name
                            TotalAssigned = totalAssigned,
                            Submitted = submitted,
                            NotSubmitted = notSubmitted
                        });
                    }
                    catch (Exception ex)
                    {
                        // Log individual form processing error but continue with other forms
                        // You can add logging here: _logger.LogError(ex, $"Error processing form {form.FormId}");

                        // Add a default entry for this form to prevent complete failure
                        result.Add(new BarChartDataDto
                        {
                            FormName = form.FormName ?? "Unknown Form",
                            TotalAssigned = 0,
                            Submitted = 0,
                            NotSubmitted = 0
                        });
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                // Return empty list instead of throwing to prevent complete dashboard failure
                return new List<BarChartDataDto>();
            }
        }

        //Top Form Responses
        private async Task<List<TopFormResponsesDto>> GetTop5FormResponsesAsync()
        {
            var query = from response in _context.FormResponse
                        join user in _context.UserTable on response.UserId equals user.UserId
                        join form in _context.FormTable on response.FormId equals form.FormId
                        // Left join to get approval status (null = Pending)
                        join approval in _context.FormResponseApproval
                            on response.ResponseId equals approval.ResponseId into approvalGroup
                        from approval in approvalGroup.DefaultIfEmpty()
                        where !response.IsSpam
                        orderby response.ResponseDate descending
                        select new TopFormResponsesDto
                        {
                            UserName = user.UserName,
                            FormName = form.FormName,
                            ResponseDate = response.ResponseDate,
                            ApprovalStatus = approval != null ? approval.Status : "Pending"
                        };

            return await query.Take(5).ToListAsync();
        }
    }
}
