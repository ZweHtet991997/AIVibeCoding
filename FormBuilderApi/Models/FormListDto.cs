namespace FormBuilderApi.Models
{
    public class FormListDto
    {
        public int FormId { get; set; }
        public string FormName { get; set; }
        public string Status { get; set; }
        public int TotalSubmissions { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
