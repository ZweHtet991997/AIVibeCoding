import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignIn from './components/SignIn';
import AdminDashboard from './components/AdminDashboard';
import UserHome from './components/UserHome';
import FormBuilderScreen from './components/dashboard/forms/FormBuilderScreen';
import BIMBot from './components/BIMBot';

function App() {
  // Use useLocation inside a wrapper component since Router must be the parent
  function AppContent() {
    const location = useLocation();
    const hideBot = location.pathname === '/';
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-home" element={<UserHome />} />
          <Route path="/form-builder" element={<FormBuilderScreen />} />
          <Route path="/form-builder/:formId" element={<FormBuilderScreen />} />
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