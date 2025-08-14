using System.ComponentModel.DataAnnotations;

namespace FormBuilderApi.Models
{
    public class CreateFormRequestDto
    {
        [Required(ErrorMessage = "Form name is required")]
        [StringLength(100, ErrorMessage = "Form name cannot exceed 100 characters")]
        [RegularExpression(@"^[^<>""/\\|?*]+$", ErrorMessage = "Form name contains invalid characters")]
        public string FormName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Form schema is required")]
        [StringLength(10000, ErrorMessage = "Form schema is too large. Maximum size is 10KB")]
        public string FormSchema { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Form URL cannot exceed 500 characters")]
        [Url(ErrorMessage = "Form URL must be a valid URL")]
        public string? FormUrl { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }
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
