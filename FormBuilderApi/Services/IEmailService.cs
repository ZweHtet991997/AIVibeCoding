using FormBuilderApi.Models;

namespace FormBuilderApi.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailRequestDto emailRequest);
        Task<bool> SendFormApprovalEmailAsync(string userEmail, string userName, string adminName, string formName, string comments, bool isApproved);
        Task<bool> SendFormAssignedEmailAsync(string userEmail, string userName, string formName, string formUrl);
        Task<bool> SendFormSubmittedEmailAsync(string adminEmail, string adminName, string userName, string userEmail, string formName);
    }
}