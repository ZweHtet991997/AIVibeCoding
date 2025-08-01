namespace FormBuilderApi.Models
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserRole { get; set; }
        public string? Email { get; set; }
    }
}
