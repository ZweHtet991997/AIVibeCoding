using FormBuilderApi.Models;
using System.Net;
using System.Net.Mail;

namespace FormBuilderApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _emailSettings = configuration.GetSection("EmailSettings").Get<EmailSettings>();
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(EmailRequestDto emailRequest)
        {
            try
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
                    Subject = GetEmailSubject(emailRequest.EmailType),
                    Body = GetEmailBody(emailRequest),
                    IsBodyHtml = true
                };

                mailMessage.To.Add(new MailAddress(emailRequest.ToEmail, emailRequest.ToName));

                using (var smtpClient = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort))
                {
                    smtpClient.Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword);
                    smtpClient.EnableSsl = _emailSettings.EnableSsl;

                    await smtpClient.SendMailAsync(mailMessage);
                }

                _logger.LogInformation($"Email sent successfully to {emailRequest.ToEmail} for {emailRequest.EmailType}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {emailRequest.ToEmail} for {emailRequest.EmailType}");
                return false;
            }
        }

        public async Task<bool> SendFormAssignedEmailAsync(string userEmail, string userName, string formName, string formUrl)
        {
            var templateData = new Dictionary<string, string>
            {
                ["userName"] = userName,
                ["formName"] = formName,
                ["assignedDate"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm"),
                ["formUrl"] = formUrl
            };

            var emailRequest = new EmailRequestDto
            {
                ToEmail = userEmail,
                ToName = userName,
                EmailType = EmailType.FormAssigned,
                TemplateData = templateData
            };

            return await SendEmailAsync(emailRequest);
        }

        public async Task<bool> SendFormSubmittedEmailAsync(string adminEmail, string adminName, string userName, string userEmail, string formName)
        {
            var templateData = new Dictionary<string, string>
            {
                ["adminName"] = adminName,
                ["formName"] = formName,
                ["userName"] = userName,
                ["userEmail"] = userEmail,
                ["submissionDate"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm")
            };

            var emailRequest = new EmailRequestDto
            {
                ToEmail = adminEmail,
                ToName = adminName,
                EmailType = EmailType.FormSubmitted,
                TemplateData = templateData
            };

            return await SendEmailAsync(emailRequest);
        }

        public async Task<bool> SendFormApprovalEmailAsync(string userEmail, string userName, string adminName, string formName, string comments, bool isApproved)
        {
            var templateData = new Dictionary<string, string>
            {
                ["userName"] = userName,
                ["formName"] = formName,
                ["adminName"] = adminName,
                ["comments"] = comments ?? "No comments provided"
            };

            if (isApproved)
            {
                templateData["approvalDate"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            }
            else
            {
                templateData["rejectionDate"] = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            }

            var emailRequest = new EmailRequestDto
            {
                ToEmail = userEmail,
                ToName = userName,
                EmailType = isApproved ? EmailType.FormApproved : EmailType.FormRejected,
                TemplateData = templateData
            };

            return await SendEmailAsync(emailRequest);
        }

        private string GetEmailSubject(EmailType emailType)
        {
            return emailType switch
            {
                EmailType.FormAssigned => "New Form Assignment",
                EmailType.FormSubmitted => "New Form Submission Received",
                EmailType.FormApproved => "Form Response Approved",
                EmailType.FormRejected => "Form Response Rejected",
                _ => "Form Builder Notification"
            };
        }

        private string GetEmailBody(EmailRequestDto emailRequest)
        {
            return emailRequest.EmailType switch
            {
                EmailType.FormAssigned => EmailTemplates.GetFormAssignedTemplate(emailRequest.TemplateData),
                EmailType.FormSubmitted => EmailTemplates.GetFormSubmittedTemplate(emailRequest.TemplateData),
                EmailType.FormApproved => EmailTemplates.GetFormApprovedTemplate(emailRequest.TemplateData),
                EmailType.FormRejected => EmailTemplates.GetFormRejectedTemplate(emailRequest.TemplateData),
                _ => throw new ArgumentException("Invalid email type")
            };
        }
    }
}
