using FormBuilderApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace FormBuilderApi.Services
{
    public class PasswordMigrationService : IPasswordMigrationService
    {
        private readonly AppDbContext _context;
        private readonly IPasswordService _passwordService;

        public PasswordMigrationService(AppDbContext context, IPasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        public async Task<bool> MigrateUserPasswordAsync(int userId, string plainTextPassword)
        {
            try
            {
                var user = await _context.UserTable.FindAsync(userId);
                if (user == null)
                    return false;

                // Hash the plain text password
                var hashedPassword = _passwordService.HashPassword(plainTextPassword);
                
                // Update the user's password
                user.Password = hashedPassword;
                
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> MigrateAllPasswordsAsync()
        {
            try
            {
                // This method should be used carefully and only when you have access to plain text passwords
                // In a real scenario, you would need to implement a secure way to get plain text passwords
                // For now, this is a placeholder that shows the concept
                
                var users = await _context.UserTable.ToListAsync();
                var migratedCount = 0;

                foreach (var user in users)
                {
                    // In a real scenario, you would need to get the plain text password from somewhere
                    // This is just a placeholder - you would need to implement this based on your specific needs
                    // For example, you might have a temporary table with plain text passwords
                    
                    // For now, we'll skip this as it requires additional implementation
                    // You would need to provide the plain text passwords in a secure way
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
} 