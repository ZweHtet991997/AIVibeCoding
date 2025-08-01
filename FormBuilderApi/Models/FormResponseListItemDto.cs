namespace FormBuilderApi.Models
{
    public class FormResponseListItemDto
    {
        public int ResponseId { get; set; }
        public int FormId { get; set; }
        public string FormName { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string FieldKey { get; set; }
        public string ResponseValue { get; set; }
        public DateTime ResponseDate { get; set; }
        public string Status { get; set; } // Pending, Approved, Rejected
        public string Comment { get; set; }
        public DateTime? DecisionDate { get; set; }
    }
}
