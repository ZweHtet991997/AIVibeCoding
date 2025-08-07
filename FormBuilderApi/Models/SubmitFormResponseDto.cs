using Microsoft.AspNetCore.Http;

public class SubmitFormResponseDto
{
    public int FormId { get; set; }
    public int UserId { get; set; }
    public string? ResponseData { get; set; }
    public IFormFile? ResponseFile { get; set; }
}