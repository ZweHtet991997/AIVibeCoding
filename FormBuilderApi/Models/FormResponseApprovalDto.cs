namespace FormBuilderApi.Models
{
    public class FormResponseApprovalDto
    {
        public int ApprovalId { get; set; }
        public int ResponseId { get; set; }
        public string Status { get; set; }
        public string Comment { get; set; }
        public DateTime? DecisionDate { get; set; }
    }
}
