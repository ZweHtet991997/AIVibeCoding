namespace FormBuilderApi.Models
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // For security, you may want to exclude this in response DTOs
        public string Role { get; set; }
    }
}
