using FormBuilderApi.Models;
using FormBuilderApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var token = await _authService.AuthenticateAsync(dto.Email, dto.Password);
            if (token == null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(new { token });
        }
    }
}
