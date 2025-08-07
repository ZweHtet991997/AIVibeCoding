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
        public string Description { get; set; }
        public string ResponseData { get; set; } // JSON string of responses
        public string? FilePath { get; set; } // Optional file path if a file was uploaded
        public DateTime ResponseDate { get; set; }
        public string Status { get; set; } // Pending, Approved, Rejected
        public string Comment { get; set; }
        public DateTime? DecisionDate { get; set; }
    }
}
