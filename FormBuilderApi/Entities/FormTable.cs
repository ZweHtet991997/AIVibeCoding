using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBuilderApi.Entities
{
    [Table("FormTable")]
    public class FormTable
    {
        [Key]
        public int FormId { get; set; }

        [Required]
        [MaxLength(200)]
        public string FormName { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public string FormSchema { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; }

        [MaxLength(250)]
        public string? FormUrl { get; set; }
    }
}
