namespace FormBuilderApi.Models
{
    public class EmailRequestDto
    {
        public string ToEmail { get; set; }
        public string ToName { get; set; }
        public EmailType EmailType { get; set; }
        public Dictionary<string, string> TemplateData { get; set; }
    }

    public enum EmailType
    {
        FormAssigned,
        FormSubmitted,
        FormApproved,
        FormRejected
    }

    public class EmailSettings
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string FromEmail { get; set; }
        public string FromName { get; set; }
        public bool EnableSsl { get; set; }
    }
}
