namespace FormBuilderApi.Models
{
    public class FormAssignmentDto
    {
        public int AssignmentId { get; set; }
        public int FormId { get; set; }
        public int UserId { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
