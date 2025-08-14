namespace FormBuilderApi.Services.Common
{
    public interface IInputValidationService
    {
        ValidationResult ValidateEmail(string email);
        ValidationResult ValidatePassword(string password);
        ValidationResult ValidateRequiredString(string value, string fieldName, int? maxLength = null);
        ValidationResult ValidateRequiredInt(int value, string fieldName, int? minValue = null, int? maxValue = null);
        ValidationResult ValidateFormSchema(string schema);
        ValidationResult ValidateFormName(string formName);
        ValidationResult ValidateUserName(string userName);
        ValidationResult ValidateRole(string role);
        ValidationResult ValidateStatus(string status);
        ValidationResult ValidateFormAssignment(int formId, int userId);
        ValidationResult ValidateFormResponse(string responseData);
        ValidationResult ValidateApprovalStatus(string status);
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; }
        public string FieldName { get; set; }

        public static ValidationResult Success() => new ValidationResult { IsValid = true };
        public static ValidationResult Failure(string fieldName, string message) => new ValidationResult 
        { 
            IsValid = false, 
            FieldName = fieldName, 
            ErrorMessage = message 
        };
    }
}
