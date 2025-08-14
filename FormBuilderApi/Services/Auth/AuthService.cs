using FormBuilderApi.Entities;
using FormBuilderApi.Models;
using FormBuilderApi.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FormBuilderApi.Services.AuthServices
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfigurationService _configurationService;
        private readonly IPasswordService _passwordService;

        public AuthService(AppDbContext context, IConfigurationService configurationService, IPasswordService passwordService)
        {
            _context = context;
            _configurationService = configurationService;
            _passwordService = passwordService;
        }

        public async Task<LoginResponseDto> AuthenticateAsync(string email, string password)
        {
            try
            {
                // Input validation
                if (string.IsNullOrWhiteSpace(email))
                    throw new ArgumentException("Email is required.", nameof(email));

                if (string.IsNullOrWhiteSpace(password))
                    throw new ArgumentException("Password is required.", nameof(password));

                //// Find user by email only (we'll verify password separately)
                //var user = _context.UserTable.FirstOrDefault(u => u.Email == email && u.Status == "Active");

                var user = _context.UserTable.FirstOrDefault(u => u.Email == email && u.Password == password && u.Status == "Active");

                if (user == null)
                    return null;

                // Verify password using secure hashing
                //if (!_passwordService.VerifyPassword(password, user.Password))
                //    return null;

                // Get JWT settings from configuration service
                var jwtSettings = _configurationService.GetJwtSettings();

                // Create JWT token
                var claims = new[]
                {
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: jwtSettings.Issuer,
                    audience: jwtSettings.Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(jwtSettings.ExpiresInMinutes),
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
            catch (Exception ex) when (ex is not ArgumentException)
            {
                // Log the error but don't expose internal details to the client
                throw new InvalidOperationException("Authentication failed. Please check your credentials and try again.");
            }
        }
    }
}
