# Backend API Integration Documentation

## Overview
This document describes the complete integration with the backend API, removing all mock data and using real API endpoints.

## API Base Configuration
- **Base URL**: `http://localhost:5000` (configured in `src/config.js`)
- **Authentication**: Bearer token authentication for all endpoints

## User Forms API Endpoints

### 1. Get Assigned Forms
**Endpoint**: `GET /api/v1/user/assigned?userId={userId}`

**Description**: Fetches all forms assigned to a specific user.

**Parameters**:
- `userId` (optional): User ID to fetch forms for. If not provided, uses current user.

**Expected Response Format**:
```json
[
  {
    "formId": 10,
    "formName": "IT Support Request",
    "description": "Form to report IT issues",
    "url": "/forms/10",
    "assignedDate": "2025-08-02T11:58:12.073",
    "submissionStatus": "Complete"
  }
]
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient privileges)
- `404`: No assigned forms found

### 2. Get Form by ID
**Endpoint**: `GET /api/v1/user/form/{formId}`

**Description**: Fetches a specific form by ID for filling.

**Parameters**:
- `formId`: The ID of the form to fetch

**Expected Response Format**:
```json
{
  "id": "form_001",
  "name": "Employee Onboarding Form",
  "description": "Please complete this form to begin your onboarding process.",
  "fields": [
    {
      "id": "full_name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true,
      "helpText": "Please enter your legal name"
    }
  ],
  "assignedAt": "2024-01-15T10:00:00Z",
  "dueDate": "2024-01-22T17:00:00Z",
  "status": "pending"
}
```

**Status Codes**:
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Form not found or not assigned to user

### 3. Submit Form Response
**Endpoint**: `POST /api/v1/user/form/{formId}/submit`

**Description**: Submits a completed form response.

**Parameters**:
- `formId`: The ID of the form being submitted

**Request Body**:
```json
{
  "full_name": "John Doe",
  "email": "john.doe@company.com",
  "phone": "+1 (555) 123-4567",
  "department": "Engineering"
}
```

**Expected Response Format**:
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "responseId": 123
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid form data
- `401`: Unauthorized
- `403`: Forbidden

## Admin API Endpoints

### 1. Dashboard Data
**Endpoint**: `GET /api/v1/admin/dashboard`

**Description**: Fetches admin dashboard statistics and data.

### 2. Forms List
**Endpoint**: `GET /api/v1/form/formlist`

**Description**: Fetches all forms for admin management.

### 3. Create Form
**Endpoint**: `POST /api/v1/form/createform`

**Description**: Creates a new form.

### 4. Get Form by ID (Admin)
**Endpoint**: `GET /api/v1/form/{formId}`

**Description**: Fetches a specific form for editing.

### 5. Form Assignments
**Endpoint**: `GET /api/v1/form/{formId}/assignments`

**Description**: Fetches user assignments for a specific form.

### 6. Assign User to Form
**Endpoint**: `POST /api/v1/form/assignform`

**Description**: Assigns a user to a form.

### 7. Remove User from Form
**Endpoint**: `DELETE /api/v1/form/removeassign?formId={formId}&userId={userId}`

**Description**: Removes a user assignment from a form.

### 8. Activate Form
**Endpoint**: `PATCH /api/v1/form/activate?formId={formId}`

**Description**: Activates a form (changes status from Draft to Active).

### 9. User List
**Endpoint**: `GET /api/v1/admin/userlist`

**Description**: Fetches all users for admin management.

### 10. Form Responses
**Endpoint**: `GET /api/v1/form/formresponse`

**Description**: Fetches form responses for approval.

### 11. Approve/Reject Form Response
**Endpoint**: `POST /api/v1/form/approve-reject`

**Description**: Approves or rejects a form response.

## Authentication

All API calls require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

The token is retrieved using the `getToken()` function from `src/utils/auth.js`.

## Error Handling

The API integration includes comprehensive error handling for:
- Network errors
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Validation errors (400)
- Server errors (500)

## Data Normalization

The UserHome component includes a `normalizeFormData` function to handle potential data format variations between the API and the frontend:

```javascript
const normalizeFormData = (form) => {
  return {
    formId: form.formId || form.id,
    formName: form.formName || form.name,
    description: form.description,
    assignedDate: form.assignedDate || form.assignedAt,
    submissionStatus: form.submissionStatus || form.status,
    url: form.url
  };
};
```

## Filtering Logic

The filtering system handles both API format and legacy format status values:
- **API Format**: "Complete", "Pending"
- **Legacy Format**: "completed", "pending"

## Files Modified

### 1. `src/utils/api.js`
- Removed all mock data imports and usage
- Enabled real API calls for all endpoints
- Removed debug console logs

### 2. `src/components/UserHome.js`
- Removed debug console logs
- Updated comments to reflect real API usage
- Maintained data normalization for compatibility

### 3. `src/utils/sampleFormData.js`
- **Deleted**: No longer needed

## Testing

To test the integration:

1. Ensure the backend server is running on `http://localhost:5000`
2. Verify authentication tokens are properly set
3. Test each endpoint with real data
4. Verify error handling works correctly
5. Test filtering and search functionality

## Notes

- All mock data has been completely removed
- The application now relies entirely on the backend API
- Error handling is comprehensive and user-friendly
- Data normalization ensures compatibility with different API response formats
- The filtering system works with both current and legacy data formats 