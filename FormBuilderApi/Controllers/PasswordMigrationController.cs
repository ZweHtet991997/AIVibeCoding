using FormBuilderApi.Models;
using FormBuilderApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilderApi.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/v1/password-migration")]
    public class PasswordMigrationController : ControllerBase
    {
        private readonly IPasswordMigrationService _passwordMigrationService;
        private readonly ILogger<PasswordMigrationController> _logger;

        public PasswordMigrationController(IPasswordMigrationService passwordMigrationService, ILogger<PasswordMigrationController> logger)
        {
            _passwordMigrationService = passwordMigrationService;
            _logger = logger;
        }

        [HttpPost("migrate-user")]
        public async Task<IActionResult> MigrateUserPassword([FromBody] PasswordMigrationRequestDto request)
        {
            try
            {
                var result = await _passwordMigrationService.MigrateUserPasswordAsync(request.UserId, request.PlainTextPassword);
                
                if (result)
                {
                    _logger.LogInformation($"Password migrated successfully for user {request.UserId}");
                    return Ok(new { message = "Password migrated successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Failed to migrate password. User may not exist." });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error migrating password for user {request.UserId}");
                return StatusCode(500, new { message = "An error occurred during password migration" });
            }
        }

        [HttpPost("migrate-all")]
        public async Task<IActionResult> MigrateAllPasswords()
        {
            try
            {
                var result = await _passwordMigrationService.MigrateAllPasswordsAsync();
                
                if (result)
                {
                    _logger.LogInformation("All passwords migrated successfully");
                    return Ok(new { message = "All passwords migrated successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Failed to migrate passwords" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error migrating all passwords");
                return StatusCode(500, new { message = "An error occurred during password migration" });
            }
        }
    }

    public class PasswordMigrationRequestDto
    {
        public int UserId { get; set; }
        public string PlainTextPassword { get; set; }
    }
} 