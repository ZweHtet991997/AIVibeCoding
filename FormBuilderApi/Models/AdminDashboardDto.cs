namespace FormBuilderApi.Models
{
    public class AdminDashboardDto
    {
        public int TotalFormsCreated { get; set; }
        public int TotalSubmissionsReceived { get; set; }
        public int TotalPendingApprovals { get; set; }
        public int TotalApproved { get; set; }
        public int TotalRejected { get; set; }
        public ApprovalStatusBreakdownDto ApprovalStatusBreakdown { get; set; }
        // Optionally: public List<SubmissionsOverTimeDto> SubmissionsOverTime { get; set; }
    }

    public class ApprovalStatusBreakdownDto
    {
        public StatusDetail Approved { get; set; }
        public StatusDetail Pending { get; set; }
        public StatusDetail Rejected { get; set; }
    }

    public class StatusDetail
    {
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
