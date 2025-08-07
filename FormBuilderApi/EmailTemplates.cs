namespace FormBuilderApi
{
    public static class EmailTemplates
    {
        public static string GetFormAssignedTemplate(Dictionary<string, string> data)
        {
            return $@"
            <html>
            <body>
                <h2>Form Assignment Notification</h2>
                <p>Dear {data["userName"]},</p>
                <p>You have been assigned a new form to complete:</p>
                <ul>
                    <li><strong>Form Name:</strong> {data["formName"]}</li>
                    <li><strong>Assigned Date:</strong> {data["assignedDate"]}</li>
                    <li><strong>Form URL:</strong> <a href='{data["formUrl"]}'>{data["formUrl"]}</a></li>
                </ul>
                <p>Please complete this form at your earliest convenience.</p>
                <p>Best regards,<br>Admin Team</p>
            </body>
            </html>";
        }

        public static string GetFormSubmittedTemplate(Dictionary<string, string> data)
        {
            return $@"
            <html>
            <body>
                <h2>Form Submission Notification</h2>
                <p>Dear {data["adminName"]},</p>
                <p>A new form response has been submitted:</p>
                <ul>
                    <li><strong>Form Name:</strong> {data["formName"]}</li>
                    <li><strong>Submitted By:</strong> {data["userName"]}</li>
                    <li><strong>Submission Date:</strong> {data["submissionDate"]}</li>
                    <li><strong>User Email:</strong> {data["userEmail"]}</li>
                </ul>
                <p>Please review and approve/reject this submission.</p>
                <p>Best regards,<br>Admin Team</p>
            </body>
            </html>";
        }

        public static string GetFormApprovedTemplate(Dictionary<string, string> data)
        {
            return $@"
            <html>
            <body>
                <h2>Form Response Approved</h2>
                <p>Dear {data["userName"]},</p>
                <p>Your form submission has been approved:</p>
                <ul>
                    <li><strong>Form Name:</strong> {data["formName"]}</li>
                    <li><strong>Approval Date:</strong> {data["approvalDate"]}</li>
                    <li><strong>Approved By:</strong> {data["adminName"]}</li>
                    <li><strong>Comments:</strong> {data["comments"]}</li>
                </ul>
                <p>Thank you for your submission!</p>
                <p>Best regards,<br>Admin Team</p>
            </body>
            </html>";
        }

        public static string GetFormRejectedTemplate(Dictionary<string, string> data)
        {
            return $@"
            <html>
            <body>
                <h2>Form Response Rejected</h2>
                <p>Dear {data["userName"]},</p>
                <p>Your form submission has been rejected:</p>
                <ul>
                    <li><strong>Form Name:</strong> {data["formName"]}</li>
                    <li><strong>Rejection Date:</strong> {data["rejectionDate"]}</li>
                    <li><strong>Rejected By:</strong> {data["adminName"]}</li>
                    <li><strong>Comments:</strong> {data["comments"]}</li>
                </ul>
                <p>Please review the comments and resubmit if necessary.</p>
                <p>Best regards,<br>Form Builder Team</p>
            </body>
            </html>";
        }
    }
}
