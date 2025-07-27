# Dashboard API Integration

## Overview
The admin dashboard now dynamically fetches and displays real-time data from the backend API when admin users log in and access the dashboard.

## API Endpoint
- **URL**: `{{baseurl}}/api/admin/dashboard`
- **Method**: GET
- **Authorization**: Bearer token (included in request headers)

## Implementation Details

### 1. API Service (`src/utils/api.js`)
- Created `dashboardAPI.getDashboardData()` function
- Handles authentication with bearer token
- Includes proper error handling for different HTTP status codes
- Uses the base URL from `src/config.js`

### 2. Summary Cards (`src/components/dashboard/SummaryCards.js`)
- Fetches and displays the following metrics:
  - Total Forms Created
  - Total Submissions Received
  - Total Pending Approvals
  - Total Approved / Rejected
- Includes loading states and error handling
- Auto-refreshes data when user returns to the tab

### 3. Approval Status Chart (`src/components/dashboard/ApprovalStatusChart.js`)
- Displays approval status breakdown as a pie chart
- Shows percentage and count for each status (Approved, Pending, Rejected)
- Uses color-coded segments for easy visualization

### 4. Admin Dashboard (`src/components/AdminDashboard.js`)
- Verifies admin privileges before loading dashboard
- Includes loading state during admin verification
- Provides manual refresh button for data updates

## Expected API Response Format
```json
{
  "totalFormsCreated": 3,
  "totalSubmissionsReceived": 6,
  "totalPendingApprovals": 1,
  "totalApproved": 3,
  "totalRejected": 2,
  "approvalStatusBreakdown": {
    "approved": {
      "count": 3,
      "percentage": 50
    },
    "pending": {
      "count": 1,
      "percentage": 16.67
    },
    "rejected": {
      "count": 2,
      "percentage": 33.33
    }
  }
}
```

## Error Handling
- **401 Unauthorized**: User needs to log in again
- **403 Forbidden**: User doesn't have admin privileges
- **Network errors**: Graceful fallback with retry options
- **Missing data**: Defaults to zero values

## Features
- ✅ Dynamic data fetching on dashboard load
- ✅ Real-time data refresh on page visibility change
- ✅ Loading states during API calls
- ✅ Error handling with retry functionality
- ✅ Admin privilege verification
- ✅ Manual refresh button
- ✅ Responsive design with proper loading indicators

## Future Enhancements
- Recent Submissions table (placeholder ready)
- Submission Overtime metrics (placeholder ready)
- Real-time updates via WebSocket
- Data caching for better performance 