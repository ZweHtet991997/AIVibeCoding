# Assign Users Modal Implementation

## Overview
The Assign Users modal has been implemented to allow admins to assign and unassign active users to/from specific forms. The implementation includes fetching active users, displaying current assignments, and saving both assignment and unassignment changes via API calls.

## Features Implemented

### 1. User List Display
- **Active Users Only**: Fetches users from `/api/v1/admin/userlist` and filters to show only users with status "Active"
- **Search Functionality**: Users can search by username or email
- **Checkbox Interface**: Each user has a checkbox for assignment selection

### 2. Assignment State Management
- **Pre-checked Boxes**: Users already assigned to the form have their checkboxes pre-checked
- **Dynamic Updates**: Checkboxes can be toggled to assign/unassign users
- **Assignment Tracking**: Tracks which users were already assigned vs newly selected

### 3. API Integration

#### Fetching Data
- **Active Users**: `GET {{baseUrl}}/api/v1/admin/userlist`
- **Form Assignments**: `GET {{baseUrl}}/api/v1/form/{formId}/assignments`

#### Saving Assignments and Unassignments
- **Assign Endpoint**: `POST {{baseUrl}}/api/v1/form/assignform`
- **Unassign Endpoint**: `DELETE {{baseUrl}}/api/v1/form/removeassign?formId=1&userId=1`
- **Request Body for Assignment**: 
  ```json
  {
    "formId": 1,
    "userId": 1
  }
  ```
- **Optimization**: Only sends requests for changes (newly selected users and newly deselected users)

### 4. User Experience Features
- **Loading States**: Shows loading spinner while fetching data
- **Error Handling**: Displays error messages for failed API calls
- **Save Progress**: Shows "Saving..." with spinner during assignment/unassignment operations
- **Form Validation**: Disables save button when no users are available or during operations

## Technical Implementation

### Files Modified
1. **`src/utils/api.js`**: Added new API functions
   - `getFormAssignments(formId)`: Fetch current form assignments
   - `assignUserToForm(formId, userId)`: Assign user to form
   - `removeUserFromForm(formId, userId)`: Remove user from form

2. **`src/components/dashboard/forms/AssignUsersModal.js`**: Complete rewrite
   - Fetches active users and current assignments on modal open
   - Handles loading states and error messages
   - Implements save functionality with both assignment and unassignment API calls
   - Provides search and filtering capabilities

3. **`src/components/dashboard/forms/FormListTable.js`**: Updated button text
   - Changed "Assign Users" to "Manage Users" to reflect full functionality

### Key Functions

#### `loadUsersAndAssignments()`
- Fetches active users and form assignments in parallel
- Filters users to show only active ones
- Sets initial checkbox states based on current assignments

#### `handleSave()`
- Identifies newly selected users (excluding already assigned)
- Identifies users to unassign (previously assigned but now deselected)
- Makes API calls for both assignment and unassignment operations in parallel
- Handles errors and shows appropriate messages

#### `handleToggle(userId)`
- Toggles user selection in the checkbox interface
- Updates the selected users array

## Usage Flow

1. **Open Modal**: Click "Manage Users" button on any form in the Forms table
2. **Load Data**: Modal automatically fetches active users and current assignments
3. **Search/Filter**: Use search box to find specific users
4. **Select Users**: Check/uncheck boxes to assign/unassign users
5. **Save**: Click "Save" to apply changes via API calls (both assignment and unassignment)
6. **Close**: Modal closes automatically on successful save

## Error Handling

- **Network Errors**: Displays error messages for failed API calls
- **Authentication Errors**: Handles 401/403 responses appropriately
- **Loading States**: Prevents user interaction during data fetching
- **Save Validation**: Prevents saving when no users are available

## API Endpoints Used

1. `GET /api/v1/admin/userlist` - Fetch all users (filtered to active)
2. `GET /api/v1/form/{formId}/assignments` - Fetch current form assignments
3. `POST /api/v1/form/assignform` - Assign user to form
4. `DELETE /api/v1/form/removeassign?formId=1&userId=1` - Remove user from form

## Notes

- The implementation handles both assignment and unassignment in a single save operation
- Form ID is dynamically passed based on the selected form
- All API calls include proper authentication headers
- Both assignment and unassignment operations are executed in parallel for better performance 