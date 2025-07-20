# Form Management Application

A modern form management application built with ReactJS, Tailwind CSS, and .NET 8 backend.

## Features

- **User Authentication**: Role-based login system
- **Admin Dashboard**: Form management, user management, and approval workflows
- **User Interface**: Submit forms and track approval status
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: ReactJS + Tailwind CSS
- **Backend**: .NET 8
- **Database**: Microsoft SQL Server (MSSQL)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── SignIn.js          # Login screen
│   ├── AdminDashboard.js  # Admin dashboard (placeholder)
│   └── UserHome.js        # User home screen (placeholder)
├── App.js                 # Main app component with routing
├── index.js              # React entry point
└── index.css             # Global styles with Tailwind
```

## Login Screen Features

- **Modern UI**: Clean, responsive design matching the provided mockup
- **Form Validation**: Email format validation and required field checks
- **Loading States**: Spinner animation during authentication
- **Error Handling**: Clear error messages for failed login attempts
- **Role-Based Navigation**: Redirects to appropriate dashboard based on user role
- **Remember Me**: Checkbox for session persistence
- **Responsive Design**: Works on all screen sizes

## API Integration

The login form makes a POST request to `/api/login` with the following structure:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Expected response:
```json
{
  "success": true,
  "role": "Admin" | "Normal User",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Development

The application is set up with:
- React Router for navigation
- Tailwind CSS for styling
- Functional components with React Hooks
- Form validation and error handling
- Loading states and user feedback

## Next Steps

1. Implement the backend API endpoints
2. Create the complete Admin Dashboard with all features
3. Build the User Home screen with form submission capabilities
4. Add email notification system
5. Implement form builder functionality