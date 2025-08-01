namespace FormBuilderApi.Models
{
    public class FormAssignmentListDto
    {
        public int AssignmentId { get; set; }
        public int FormId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
