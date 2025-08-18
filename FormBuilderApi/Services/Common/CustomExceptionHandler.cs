using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data;

namespace FormBuilderApi.Services.Common
{
    public class CustomExceptionHandler : ICustomExceptionHandler
    {
        private readonly ILogger<CustomExceptionHandler> _logger;

        public CustomExceptionHandler(ILogger<CustomExceptionHandler> logger)
        {
            _logger = logger;
        }

        public Exception HandleDatabaseException(Exception ex, string operation)
        {
            _logger.LogError(ex, $"Database error during {operation}");

            if (ex is DbUpdateException dbEx)
            {
                if (dbEx.InnerException is SqlException sqlEx)
                {
                    switch (sqlEx.Number)
                    {
                        case 547: // Foreign key constraint violation
                            return new InvalidOperationException($"Cannot perform {operation} due to related data constraints.");
                        case 2601: // Unique constraint violation
                        case 2627: // Primary key violation
                            return new InvalidOperationException($"Duplicate entry found during {operation}.");
                        case 4060: // Database not accessible
                            return new InvalidOperationException("Database is currently not accessible. Please try again later.");
                        case 18456: // Login failed
                            return new InvalidOperationException("Database authentication failed. Please contact administrator.");
                        default:
                            return new InvalidOperationException($"Database error occurred during {operation}. Error code: {sqlEx.Number}");
                    }
                }
                return new InvalidOperationException($"Database update failed during {operation}.");
            }

            if (ex is SqlException sqlException)
            {
                return new InvalidOperationException($"Database operation failed: {sqlException.Message}");
            }

            return new InvalidOperationException($"An unexpected database error occurred during {operation}.");
        }

        public Exception HandleValidationException(string fieldName, string message)
        {
            _logger.LogWarning($"Validation error for field '{fieldName}': {message}");
            return new ArgumentException($"Validation failed for {fieldName}: {message}", fieldName);
        }

        public Exception HandleTimeoutException(string operation)
        {
            _logger.LogError($"Timeout occurred during {operation}");
            return new TimeoutException($"Operation '{operation}' timed out. Please try again.");
        }

        public Exception HandleNullReferenceException(string objectName, string operation)
        {
            _logger.LogError($"Null reference exception for {objectName} during {operation}");
            return new InvalidOperationException($"Required object '{objectName}' was not found during {operation}.");
        }

        public Exception HandleUnauthorizedException(string operation)
        {
            _logger.LogWarning($"Unauthorized access attempt for operation: {operation}");
            return new UnauthorizedAccessException($"You are not authorized to perform {operation}.");
        }

        public Exception HandleNotFoundException(string resourceType, string identifier)
        {
            _logger.LogWarning($"{resourceType} with identifier '{identifier}' not found");
            return new KeyNotFoundException($"{resourceType} with identifier '{identifier}' was not found.");
        }

        public Exception HandleBusinessRuleException(string rule, string details)
        {
            _logger.LogWarning($"Business rule violation: {rule} - {details}");
            return new InvalidOperationException($"Business rule violation: {rule}. {details}");
        }
    }
}
