import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignIn from './components/SignIn';
import AdminDashboard from './components/AdminDashboard';
import UserHome from './components/UserHome';
import FormBuilderScreen from './components/dashboard/forms/FormBuilderScreen';
import BIMBot from './components/BIMBot';
import { isTokenExpired, getUser, getToken, isAuthenticated, isAdmin, logout } from './utils/auth';

// Protected route component
function ProtectedRoute({ children, adminOnly }) {
  const token = getToken();
  if (!isAuthenticated() || isTokenExpired(token)) {
    logout();
    return <Navigate to="/" replace />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Sign-in route component that redirects if already authenticated
function SignInRoute() {
  const token = getToken();
  const user = getUser();
  
  if (token && user && !isTokenExpired(token)) {
    if (user.userRole === 'Admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/user-home" replace />;
    }
  }
  
  return <SignIn />;
}

function App() {
  // Use useLocation inside a wrapper component since Router must be the parent
  function AppContent() {
    const location = useLocation();
    const hideBot = location.pathname === '/';
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<SignInRoute />} />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-home" element={
            <ProtectedRoute>
              <UserHome />
            </ProtectedRoute>
          } />
          <Route path="/form-builder" element={
            <ProtectedRoute>
              <FormBuilderScreen />
            </ProtectedRoute>
          } />
          <Route path="/form-builder/:formId" element={
            <ProtectedRoute>
              <FormBuilderScreen />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!hideBot && <BIMBot />}
      </div>
    );
  }
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 