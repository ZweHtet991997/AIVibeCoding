using FormBuilderApi.Services.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Net;
using System.Text.Json;

namespace FormBuilderApi.Middleware
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            var errorResponse = new ErrorResponse();

            switch (exception)
            {
                case ArgumentException argEx:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Message = argEx.Message;
                    errorResponse.FieldName = argEx.ParamName;
                    _logger.LogWarning($"Validation error: {argEx.Message}");
                    break;

                case InvalidOperationException invOpEx:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Message = invOpEx.Message;
                    _logger.LogWarning($"Business rule violation: {invOpEx.Message}");
                    break;

                case KeyNotFoundException keyNotFoundEx:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse.Message = keyNotFoundEx.Message;
                    _logger.LogWarning($"Resource not found: {keyNotFoundEx.Message}");
                    break;

                case UnauthorizedAccessException unauthEx:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResponse.Message = unauthEx.Message;
                    _logger.LogWarning($"Unauthorized access: {unauthEx.Message}");
                    break;

                case TimeoutException timeoutEx:
                    response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    errorResponse.Message = timeoutEx.Message;
                    _logger.LogError($"Timeout error: {timeoutEx.Message}");
                    break;

                case DbUpdateException dbEx:
                    var exceptionHandler = context.RequestServices.GetRequiredService<ICustomExceptionHandler>();
                    var handledException = exceptionHandler.HandleDatabaseException(dbEx, "database operation");
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.Message = handledException.Message;
                    _logger.LogError(dbEx, "Database error occurred");
                    break;

                case SqlException sqlEx:
                    var sqlExceptionHandler = context.RequestServices.GetRequiredService<ICustomExceptionHandler>();
                    var sqlHandledException = sqlExceptionHandler.HandleDatabaseException(sqlEx, "SQL operation");
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.Message = sqlHandledException.Message;
                    _logger.LogError(sqlEx, "SQL error occurred");
                    break;

                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.Message = "An unexpected error occurred. Please try again later.";
                    _logger.LogError(exception, "Unexpected error occurred");
                    break;
            }

            errorResponse.StatusCode = response.StatusCode;
            errorResponse.Timestamp = DateTime.UtcNow;

            var result = JsonSerializer.Serialize(errorResponse);
            await response.WriteAsync(result);
        }
    }

    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? FieldName { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
