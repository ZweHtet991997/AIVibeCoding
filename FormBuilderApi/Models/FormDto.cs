namespace FormBuilderApi.Models
{
    public class CreateFormRequestDto
    {
        public string FormName { get; set; }
        public string FormSchema { get; set; }
        public string Status { get; set; }
        public string FormUrl { get; set; }
    }

    public class PublishFormResponseDto
    {
        public string FormName { get; set; }
        public string FormUrl { get; set; }
    }

    public class FormInfoDto
    {
        public int FormId { get; set; }
        public string FormName { get; set; }
        public string FormSchema { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; }
        public string FormUrl { get; set; }
    }
}
