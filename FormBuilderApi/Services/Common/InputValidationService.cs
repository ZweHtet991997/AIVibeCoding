using System.Text.RegularExpressions;

namespace FormBuilderApi.Services.Common
{
    public class InputValidationService : IInputValidationService
    {
        private readonly ILogger<InputValidationService> _logger;

        public InputValidationService(ILogger<InputValidationService> logger)
        {
            _logger = logger;
        }

        public ValidationResult ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return ValidationResult.Failure("Email", "Email is required.");

            if (email.Length > 255)
                return ValidationResult.Failure("Email", "Email cannot exceed 255 characters.");

            // Basic email regex pattern
            var emailPattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            if (!Regex.IsMatch(email, emailPattern))
                return ValidationResult.Failure("Email", "Invalid email format.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                return ValidationResult.Failure("Password", "Password is required.");

            if (password.Length < 8)
                return ValidationResult.Failure("Password", "Password must be at least 8 characters long.");

            if (password.Length > 128)
                return ValidationResult.Failure("Password", "Password cannot exceed 128 characters.");

            // Check for at least one uppercase letter, one lowercase letter, and one number
            if (!Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)"))
                return ValidationResult.Failure("Password", "Password must contain at least one uppercase letter, one lowercase letter, and one number.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidateRequiredString(string value, string fieldName, int? maxLength = null)
        {
            if (string.IsNullOrWhiteSpace(value))
                return ValidationResult.Failure(fieldName, $"{fieldName} is required.");

            if (maxLength.HasValue && value.Length > maxLength.Value)
                return ValidationResult.Failure(fieldName, $"{fieldName} cannot exceed {maxLength.Value} characters.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidateRequiredInt(int value, string fieldName, int? minValue = null, int? maxValue = null)
        {
            if (minValue.HasValue && value < minValue.Value)
                return ValidationResult.Failure(fieldName, $"{fieldName} must be at least {minValue.Value}.");

            if (maxValue.HasValue && value > maxValue.Value)
                return ValidationResult.Failure(fieldName, $"{fieldName} cannot exceed {maxValue.Value}.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidateFormSchema(string schema)
        {
            if (string.IsNullOrWhiteSpace(schema))
                return ValidationResult.Failure("FormSchema", "Form schema is required.");

            if (schema.Length > 10000) // 10KB limit for form schema
                return ValidationResult.Failure("FormSchema", "Form schema is too large. Maximum size is 10KB.");

            // Basic JSON validation
            try
            {
                System.Text.Json.JsonDocument.Parse(schema);
            }
            catch
            {
                return ValidationResult.Failure("FormSchema", "Form schema must be valid JSON.");
            }

            return ValidationResult.Success();
        }

        public ValidationResult ValidateFormName(string formName)
        {
            var result = ValidateRequiredString(formName, "FormName", 100);
            if (!result.IsValid) return result;

            // Check for invalid characters
            if (Regex.IsMatch(formName, @"[<>""/\\|?*]"))
                return ValidationResult.Failure("FormName", "Form name contains invalid characters.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidateUserName(string userName)
        {
            var result = ValidateRequiredString(userName, "UserName", 100);
            if (!result.IsValid) return result;

            // Check for invalid characters
            if (Regex.IsMatch(userName, @"[<>""/\\|?*]"))
                return ValidationResult.Failure("UserName", "User name contains invalid characters.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidateRole(string role)
        {
            var result = ValidateRequiredString(role, "Role", 50);
            if (!result.IsValid) return result;

            // Validate against allowed roles
            var allowedRoles = new[] { "Admin", "User", "Manager" };
            if (!allowedRoles.Contains(role, StringComparer.OrdinalIgnoreCase))
                return ValidationResult.Failure("Role", $"Role must be one of: {string.Join(", ", allowedRoles)}.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidateStatus(string status)
        {
            var result = ValidateRequiredString(status, "Status", 50);
            if (!result.IsValid) return result;

            // Validate against allowed statuses
            var allowedStatuses = new[] { "Active", "Inactive", "Draft", "Pending", "Approved", "Rejected" };
            if (!allowedStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                return ValidationResult.Failure("Status", $"Status must be one of: {string.Join(", ", allowedStatuses)}.");

            return ValidationResult.Success();
        }

        public ValidationResult ValidateFormAssignment(int formId, int userId)
        {
            var formIdResult = ValidateRequiredInt(formId, "FormId", 1);
            if (!formIdResult.IsValid) return formIdResult;

            var userIdResult = ValidateRequiredInt(userId, "UserId", 1);
            if (!userIdResult.IsValid) return userIdResult;

            return ValidationResult.Success();
        }

        public ValidationResult ValidateFormResponse(string responseData)
        {
            if (string.IsNullOrWhiteSpace(responseData))
                return ValidationResult.Failure("ResponseData", "Response data is required.");

            if (responseData.Length > 50000) // 50KB limit for response data
                return ValidationResult.Failure("ResponseData", "Response data is too large. Maximum size is 50KB.");

            // Basic JSON validation
            try
            {
                System.Text.Json.JsonDocument.Parse(responseData);
            }
            catch
            {
                return ValidationResult.Failure("ResponseData", "Response data must be valid JSON.");
            }

            return ValidationResult.Success();
        }

        public ValidationResult ValidateApprovalStatus(string status)
        {
            var result = ValidateRequiredString(status, "Status", 50);
            if (!result.IsValid) return result;

            // Validate against allowed approval statuses
            var allowedStatuses = new[] { "Approved", "Rejected", "Pending" };
            if (!allowedStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
                return ValidationResult.Failure("Status", $"Approval status must be one of: {string.Join(", ", allowedStatuses)}.");

            return ValidationResult.Success();
        }
    }
}
