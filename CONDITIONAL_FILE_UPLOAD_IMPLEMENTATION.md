# Conditional File Upload Implementation

## Overview
This implementation handles conditional file uploads when submitting forms using the `POST {{baseUrl}}/api/v1/user/submitresponse` endpoint. The system dynamically detects whether a form contains file upload fields and conditionally includes file data in the submission.

## API Endpoint
- **URL**: `POST {{baseUrl}}/api/v1/user/submitresponse`
- **Content-Type**: `multipart/form-data`
- **Authentication**: Bearer token required

## Request Format

### When File Upload Fields Are Present
```javascript
// FormData body
{
  userId: "6",
  formId: "7", 
  responseData: "[{\"field\":\"First Name\",\"value\":\"Survey\",\"type\":\"text\"},{\"field\":\"Last Name\",\"value\":\"Test\",\"type\":\"text\"},{\"field\":\"Email\",\"value\":\"survey@gmail.com\",\"type\":\"email\"},{\"field\":\"City\",\"value\":\"Nay Pyi Taw\",\"type\":\"select\"},{\"field\":\"Gender\",\"value\":\"Female\",\"type\":\"radio\"},{\"field\":\"New File Field\",\"value\":\"profile.jpg\",\"type\":\"file\"}]",
  file: [File object]
}
```

### When No File Upload Fields Are Present
```javascript
// FormData body
{
  userId: "6",
  formId: "7",
  responseData: "[{\"field\":\"First Name\",\"value\":\"Survey\",\"type\":\"text\"},{\"field\":\"Last Name\",\"value\":\"Test\",\"type\":\"text\"},{\"field\":\"Email\",\"value\":\"survey@gmail.com\",\"type\":\"email\"},{\"field\":\"City\",\"value\":\"Nay Pyi Taw\",\"type\":\"select\"},{\"field\":\"Gender\",\"value\":\"Female\",\"type\":\"radio\"}]"
  // No file field included
}
```

## Implementation Details

### 1. File Field Detection
The system checks if the form schema contains file upload fields:
```javascript
const hasFileFields = formSchema.fields.some(field => 
  field.type === 'file' || field.type === 'fileupload'
);
```

### 2. Response Data Processing
For file fields, the system stores the filename(s) in the responseData:
- **Single file**: Stores the filename
- **Multiple files**: Stores comma-separated filenames
- **File upload**: Uses the first file for actual upload, stores all filenames

### 3. Conditional File Upload
The API call conditionally includes the file:
```javascript
const result = await userFormsAPI.submitFormResponse(
  parseInt(formId), 
  userId, 
  responseDataString, 
  hasFileFields ? fileToUpload : null
);
```

### 4. API Function Updates
The `submitFormResponse` function in `src/utils/api.js` has been updated to:
- Accept an optional `file` parameter
- Use `FormData` instead of JSON for multipart/form-data submission
- Conditionally append the file to FormData when provided

## File Types Supported
- `file`: Standard file upload field
- `fileupload`: Alternative file upload field type

## Validation
- **Required validation**: Ensures file is selected for required file fields
- **File size validation**: 2MB limit per file
- **Multiple files**: Supported with comma-separated filename storage

## Benefits
1. **Backward Compatibility**: Works with both file and non-file forms
2. **Efficient**: Only includes file data when necessary
3. **Flexible**: Supports single and multiple file uploads
4. **Consistent**: Maintains the same API structure for all form types

## Example Usage
```javascript
// Form with file upload
const formWithFile = {
  fields: [
    { id: "name", type: "text", label: "Name" },
    { id: "document", type: "file", label: "Document" }
  ]
};
// Result: Includes file in FormData

// Form without file upload  
const formWithoutFile = {
  fields: [
    { id: "name", type: "text", label: "Name" },
    { id: "email", type: "email", label: "Email" }
  ]
};
// Result: No file field in FormData
``` 