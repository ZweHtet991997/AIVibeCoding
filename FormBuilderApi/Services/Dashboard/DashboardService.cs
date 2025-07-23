using FormBuilderApi.Entities;
using FormBuilderApi.Models;

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
            // Total forms created
            var totalFormsCreated = _context.FormTable.Count();

            // Total submissions received
            var totalSubmissionsReceived = _context.FormResponse.Count();

            // Approval status counts
            var totalPending = _context.FormResponseApproval.Count(a => a.Status == "Pending");
            var totalApproved = _context.FormResponseApproval.Count(a => a.Status == "Approved");
            var totalRejected = _context.FormResponseApproval.Count(a => a.Status == "Rejected");

            var totalResponses = totalPending + totalApproved + totalRejected;

            // Calculate percentages (avoid division by zero)
            double percentApproved = totalResponses > 0 ? totalApproved * 100.0 / totalResponses : 0;
            double percentPending = totalResponses > 0 ? totalPending * 100.0 / totalResponses : 0;
            double percentRejected = totalResponses > 0 ? totalRejected * 100.0 / totalResponses : 0;

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
                }
            };

            return await Task.FromResult(dto);
        }
    }
}
