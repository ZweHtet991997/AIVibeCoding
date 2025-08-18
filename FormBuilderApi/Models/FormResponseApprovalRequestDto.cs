namespace FormBuilderApi.Models
{
    public class FormResponseApprovalRequestDto
    {
        public int ResponseId { get; set; }
        public string Status { get; set; } // "Approved" or "Rejected"
        public string Comment { get; set; }
        public int ApprovedBy { get; set; } // UserId of the approver
    }
}
