using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBuilderApi.Entities
{
    [Table("FormResponse")]
    public class FormResponse
    {
        [Key]
        public int ResponseId { get; set; }

        [Required]
        public int FormId { get; set; }

        [Required]
        public int UserId { get; set; }

        public string? ResponseData { get; set; }
        public string? FilePath { get; set; }

        [Required]
        public DateTime ResponseDate { get; set; }
    }
}
