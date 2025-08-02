# Form Filler Implementation

## Overview
The Form Filler component dynamically renders form fields based on a schema returned from the backend API. It provides a clean, responsive interface for users to fill out forms with comprehensive validation and error handling.

## Features Implemented

### 1. API Integration
- **Endpoint**: `POST {{baseUrl}}/api/v1/user/form-details`
- **Request Body**: 
  ```json
  {
    "userId": 2,
    "formId": 7
  }
  ```
- **Response**: Contains `formSchema` as stringified JSON
- **Authentication**: Uses Bearer token from localStorage

### 2. Dynamic Form Rendering
The component supports all required field types:
- **Text**: Single line text input
- **Email**: Email input with validation
- **Number**: Numeric input with validation
- **Select**: Dropdown with options
- **Radio**: Radio button group
- **Checkbox**: Single checkbox
- **Text Area**: Multi-line text input
- **Date**: Date picker
- **File**: File upload with size validation

### 3. Form Validation
- **Required Fields**: Validates required fields and shows error messages
- **Email Validation**: Regex-based email format validation
- **Number Validation**: Ensures valid numeric input
- **File Size Validation**: Prevents uploads larger than 2MB
- **Real-time Error Clearing**: Errors clear when user starts typing

### 4. UI/UX Features
- **Modern Design**: Clean, glassmorphism-inspired interface
- **Responsive Layout**: Works on all screen sizes
- **Loading States**: Shows loading spinner while fetching form
- **Error Handling**: Displays user-friendly error messages
- **File Upload Feedback**: Shows selected file name and size
- **Accessibility**: Proper labels, ARIA attributes, and keyboard navigation

### 5. State Management
- **Form Data**: Tracks all field values
- **Validation Errors**: Manages field-specific error messages
- **File Errors**: Separate handling for file upload errors
- **Loading States**: Manages loading and submission states

## Component Structure

### Main States
```javascript
const [formSchema, setFormSchema] = useState(null);
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState(null);
const [fileErrors, setFileErrors] = useState({});
```

### Key Functions
- `fetchFormSchema()`: Fetches and parses form schema from API
- `handleInputChange()`: Updates form data and clears errors
- `handleFileChange()`: Handles file uploads with size validation
- `validateForm()`: Comprehensive form validation
- `renderField()`: Dynamically renders different field types
- `handleSubmit()`: Processes form submission

## Form Schema Structure
Expected schema format:
```json
{
  "title": "Form Title",
  "description": "Form description",
  "fields": [
    {
      "id": "field1",
      "name": "Field Name",
      "type": "text|email|number|select|radio|checkbox|text area|date|file",
      "required": true|false,
      "placeholder": "Placeholder text",
      "helpText": "Help text",
      "options": [
        {"value": "option1", "label": "Option 1"},
        {"value": "option2", "label": "Option 2"}
      ]
    }
  ]
}
```

## Error Handling
- **API Errors**: Network, authentication, and server errors
- **Validation Errors**: Field-specific validation messages
- **File Errors**: Size limit and format validation
- **Schema Errors**: Invalid JSON or missing required fields

## File Upload Features
- **Size Limit**: Maximum 2MB per file
- **Accepted Types**: Images, PDFs, and documents
- **Visual Feedback**: Shows file name and size
- **Error Messages**: Clear feedback for oversized files

## Styling
- **Tailwind CSS**: Utility-first styling approach
- **Glassmorphism**: Modern glass-like effects
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions and keyframes
- **Consistent Theming**: Blue/indigo color scheme

## Future Enhancements
- **Form Submission API**: Integration with actual submit endpoint
- **File Upload Progress**: Progress bar for large files
- **Auto-save**: Periodic form data saving
- **Form Templates**: Pre-filled form templates
- **Offline Support**: Local storage for offline form filling

## Usage
The component is automatically used when navigating to `/form-filler/:formId` where `:formId` is the ID of the form to be filled.

## Dependencies
- React Router for navigation
- Tailwind CSS for styling
- Custom API utilities for backend communication
- Auth utilities for user authentication 