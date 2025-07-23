using FormBuilderApi.Models;

namespace FormBuilderApi.Services.AuthServices
{
    public interface IAuthService
    {
        Task<string> AuthenticateAsync(string email, string password);
    }
}
