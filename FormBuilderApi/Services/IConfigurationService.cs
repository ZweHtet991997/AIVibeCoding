using FormBuilderApi.Models;

namespace FormBuilderApi.Services
{
    public interface IConfigurationService
    {
        string GetConnectionString();
        JwtSettings GetJwtSettings();
        EmailSettings GetEmailSettings();
        string GetEncryptionKey();
    }
} 