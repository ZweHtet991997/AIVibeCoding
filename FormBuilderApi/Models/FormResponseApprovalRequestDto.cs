namespace FormBuilderApi.Models
{
    public class FormResponseApprovalRequestDto
    {
        public int ResponseId { get; set; }
        public string Status { get; set; } // "Approved" or "Rejected"
        public int ApprovedBy { get; set; } // User ID of the approver
        public string Comment { get; set; }
    }
}
