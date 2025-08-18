using Microsoft.AspNetCore.Http;

public class SubmitFormRequestDto
{
    public int FormId { get; set; }
    public int UserId { get; set; }
    public string? ResponseData { get; set; }
    public int AssignedBy { get; set; }
    public bool IsSpam { get; set; }
    public IFormFile? ResponseFile { get; set; }
}