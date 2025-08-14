using System.Data;

namespace FormBuilderApi.Services.Common
{
    public interface ICustomExceptionHandler
    {
        Exception HandleDatabaseException(Exception ex, string operation);
        Exception HandleValidationException(string fieldName, string message);
        Exception HandleTimeoutException(string operation);
        Exception HandleNullReferenceException(string objectName, string operation);
        Exception HandleUnauthorizedException(string operation);
        Exception HandleNotFoundException(string resourceType, string identifier);
        Exception HandleBusinessRuleException(string rule, string details);
    }
}
