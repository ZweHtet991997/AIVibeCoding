namespace FormBuilderApi.Models
{
    public class FormDto
    {
        public int FormId { get; set; }
        public string FormName { get; set; }
        public string FormSchema { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; }
    }
}
