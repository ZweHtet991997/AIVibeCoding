using FormBuilderApi.Models;

namespace FormBuilderApi.Services.AuthServices
{
    public interface IAuthService
    {
        Task<LoginResponseDto> AuthenticateAsync(string email, string password);
    }
}
