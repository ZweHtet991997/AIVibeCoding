using FormBuilderApi.Models;

namespace FormBuilderApi.Services
{
    public class ConfigurationService : IConfigurationService
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public ConfigurationService(IConfiguration configuration, IWebHostEnvironment environment)
        {
            _configuration = configuration;
            _environment = environment;
        }

        public string GetConnectionString()
        {
            // For development, use the connection string from appsettings
            // For production, you would implement environment-specific logic here
            if (_environment.IsDevelopment())
            {
                return _configuration.GetConnectionString("DefaultConnection") ?? 
                       "Server=DESKTOP-PURN3M6\\SQLUSER01;Database=MachineMind;Trusted_Connection=True;TrustServerCertificate=True;User Id=sa;Password=Raptor22**";
            }
            
            // Production connection string - in real scenario, this would come from environment variables
            // or secure configuration management
            return "Server=SQL5113.site4now.net;Database=db_a9a6b3_fishfrenzy;TrustServerCertificate=True;User Id=db_a9a6b3_fishfrenzy_admin;Password=NKsoftwarehouse*11";
        }

        public JwtSettings GetJwtSettings()
        {
            return new JwtSettings
            {
                Key = "p7v9y$B&E)H@McQfTjWnZr4u7x!A%D*G", // 32+ chars, random, complex, not guessable
                Issuer = "https://api.bimgoc.com", // Use your real API domain or a unique URI
                Audience = "https://app.bimgoc.com", // Use your frontend/client domain or a unique URI
                ExpiresInMinutes = 60
            };
        }

        public EmailSettings GetEmailSettings()
        {
            return new EmailSettings
            {
                SmtpServer = "smtp.gmail.com",
                SmtpPort = 587,
                SmtpUsername = "zwehtet.nksoftwarehouse@gmail.com",
                SmtpPassword = "riftwqktrxudiiky",
                FromEmail = "zwehtet.nksoftwarehouse@gmail.com",
                FromName = "Form Builder System",
                EnableSsl = true
            };
        }

        public string GetEncryptionKey()
        {
            return "K8s9mN2pQ5rT7vX1zA4cF6hJ9kL3nO8q";
        }
    }
} 