using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBuilderApi.Entities
{
    [Table("FormResponseApproval")]
    public class FormResponseApproval
    {
        [Key]
        public int ApprovalId { get; set; }

        [Required]
        public int ResponseId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }

        public string? Comment { get; set; }

        public DateTime? DecisionDate { get; set; }
    }
}
