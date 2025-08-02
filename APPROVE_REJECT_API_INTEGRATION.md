# Approve/Reject API Integration

## Overview
This document describes the implementation of the approve/reject functionality integrated with the backend API.

## API Endpoint
- **URL**: `{{baseUrl}}/api/v1/form/approve-reject`
- **Method**: POST
- **Authentication**: Bearer token required

## Request Body
```json
{
  "responseId": 11080490,
  "status": "Rejected", // or "Approved"
  "comment": "" // Optional comment input
}
```

## Implementation Details

### 1. API Service (`src/utils/api.js`)
Added `approveRejectForm` method to the `approvalsAPI` service:

```javascript
async approveRejectForm(responseId, status, comment = '') {
  // Validates input parameters
  // Makes POST request to /api/v1/form/approve-reject
  // Handles various HTTP status codes with user-friendly error messages
  // Returns API response data
}
```

**Features:**
- Input validation for responseId and status
- Comprehensive error handling for different HTTP status codes
- User-friendly error messages
- Proper authentication token handling

### 2. UI Integration (`src/components/dashboard/ApprovalsScreen.js`)

**Key Features:**
- Real-time API calls when Approve/Reject buttons are clicked
- Optional comment input field for both approve and reject actions
- Success/error notifications using the existing ErrorModal component
- Automatic data refresh after successful actions
- Loading states during API calls
- Input validation and error handling

**User Experience:**
- Users can add optional comments when approving or rejecting
- Clear feedback through success/error modals
- Real-time UI updates after successful actions
- Disabled buttons during processing to prevent double-clicks
- Automatic comment field clearing after successful actions

### 3. Error Handling

**HTTP Status Codes Handled:**
- `401`: Unauthorized access - prompts user to log in again
- `403`: Access denied - admin privileges required
- `404`: Form response not found
- `400`: Invalid request data
- `409`: Form response already processed
- `500+`: Generic server errors

**Validation Errors:**
- Missing response ID
- Invalid status values (must be "Approved" or "Rejected")
- Missing authentication token

### 4. Success Flow
1. User clicks Approve or Reject button
2. Optional comment is captured from textarea
3. API request is sent with responseId, status, and comment
4. On success:
   - Success notification is shown
   - Modal is closed
   - Comment field is cleared
   - Data is refreshed from server
   - UI is updated with new status

### 5. Error Flow
1. If API call fails:
   - Error notification is shown with specific error message
   - Modal remains open for user to retry
   - Loading state is cleared
   - User can modify comment and retry

## Usage Example

```javascript
// In ApprovalsScreen component
const handleAction = async (status) => {
  try {
    await approvalsAPI.approveRejectForm(
      selectedSubmission.id, 
      status, 
      actionComment.trim()
    );
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Testing
To test the integration:
1. Navigate to the Approvals screen
2. Click "View" on a pending submission
3. Add an optional comment
4. Click "Approve" or "Reject"
5. Verify the API call is made with correct parameters
6. Check that success/error messages are displayed appropriately
7. Confirm the UI updates with the new status

## Configuration
The API base URL is configured in `src/config.js`:
```javascript
const apiConfig = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'
};
```

Set the `REACT_APP_API_BASE_URL` environment variable to point to your backend server. 