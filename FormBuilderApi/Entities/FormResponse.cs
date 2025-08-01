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

        [Required]
        [MaxLength(100)]
        public string FieldKey { get; set; }

        [Required]
        public string ResponseValue { get; set; }
        [Required]
        public DateTime ResponseDate { get; set; }
    }
}
