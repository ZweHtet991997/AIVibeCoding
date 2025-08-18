using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBuilderApi.Entities
{
    [Table("FormAssignment")]
    public class FormAssignment
    {
        [Key]
        public int AssignmentId { get; set; }

        [Required]
        public int FormId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime AssignedAt { get; set; }
        public int AssignedBy { get; set; }
    }
}
