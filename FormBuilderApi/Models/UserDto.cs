namespace FormBuilderApi.Models
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // For security, you may want to exclude this in response DTOs
        public string Role { get; set; }
        public string Status { get; set; }
    }

    public class SubmitFormResponseDto
    {
        public int FormId { get; set; }
        public int UserId { get; set; }
        public string ResponseData { get; set; } // JSON string of responses
    }

    public class UserAssignedFormsDto
    {
        public int FormId { get; set; }
        public string FormName { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public DateTime AssignedDate { get; set; }
        public int AssignedBy { get; set; }
        public string SubmissionStatus { get; set; } // "Submitted", "Not Submitted"
    }

    public class UserAssignedFormDetailsDto
    {
        public int FormId { get; set; }
        public string FormName { get; set; }
        public string Description { get; set; }
        public string FormSchema { get; set; }
    }

    public class UserAssignedFormRequestModel
    {
        public int UserId { get; set; }
        public int FormId { get; set; }
    }

    public class UserResponsesSummaryDto
    {
        public List<UserSubmittedResponsesDto> Responses { get; set; }
        public ResponseSummary Summary { get; set; }
    }

    public class ResponseSummary
    {
        public int TotalResponses { get; set; }
        public int ApprovedCount { get; set; }
        public int RejectedCount { get; set; }
        public int PendingCount { get; set; }
    }

    public class UserSubmittedResponsesDto
    {
        public int ResponseId { get; set; }
        public string FormName { get; set; }
        public string ResponseValue { get; set; }
        public DateTime ResponseDate { get; set; }
        public string ApprovalStatus { get; set; } // "Approved", "Rejected", "Pending"
        public string AdminComment { get; set; }
        public DateTime? DecisionDate { get; set; }
    }
}
