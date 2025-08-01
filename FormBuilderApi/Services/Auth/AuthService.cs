using FormBuilderApi.Entities;
using FormBuilderApi.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FormBuilderApi.Services.AuthServices
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly IAesEncryptionService _encryptionService;

        public AuthService(AppDbContext context, IOptions<JwtSettings> jwtOptions, IAesEncryptionService encryptionService)
        {
            _context = context;
            _jwtSettings = jwtOptions.Value;
            _encryptionService = encryptionService;
        }

        public async Task<LoginResponseDto> AuthenticateAsync(string email, string password)
        {
            // Find user by email and password (hash password in production!)
            var user = _context.UserTable.FirstOrDefault(u => u.Email == email && u.Password == password && u.Status=="Active");
            if (user == null)
                return null;

            // Create JWT token
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes),
                signingCredentials: creds
            );

            // Convert the token to a string
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new LoginResponseDto
            {
                Token = tokenString,
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                UserRole = user.Role
            };
        }
    }
}
