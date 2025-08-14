namespace FormBuilderApi.Services
{
    public interface IPasswordMigrationService
    {
        Task<bool> MigrateUserPasswordAsync(int userId, string plainTextPassword);
        Task<bool> MigrateAllPasswordsAsync();
    }
} 