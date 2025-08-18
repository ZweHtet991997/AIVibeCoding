namespace FormBuilderApi.Models
{
    public class FormAssignmentRequestDto
    {
        public int FormId { get; set; }
        public int UserId { get; set; }
        public int AssignedBy { get; set; } // UserId of the person assigning the form
    }
}
