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
        public List<TopFormResponsesDto> TopFormResponses { get; set; } // Top 5 form responses
        public List<BarChartDataDto> BarChartData { get; set; } // Bar chart data for forms
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

    public class TopFormResponsesDto
    {
        public string UserName { get; set; }
        public string FormName { get; set; }
        public DateTime ResponseDate { get; set; }
        public string ApprovalStatus { get; set; }
    }

    public class BarChartDataDto
    {
        public string FormName { get; set; }
        public int TotalAssigned { get; set; }
        public int Submitted { get; set; }
        public int NotSubmitted { get; set; }
    }
}
