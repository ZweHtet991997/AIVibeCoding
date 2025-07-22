using FormBuilderApi.Models;

namespace FormBuilderApi.Services
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(string email, string password);
    }
}
