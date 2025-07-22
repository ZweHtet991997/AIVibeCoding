namespace FormBuilderApi.Models
{
    public class FormResponseDto
    {
        public int ResponseId { get; set; }
        public int FormId { get; set; }
        public int UserId { get; set; }
        public string FieldKey { get; set; }
        public string ResponseValue { get; set; }
    }
}
