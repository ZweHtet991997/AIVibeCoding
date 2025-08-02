// Utility to decode JWT and check expiry
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false; // If no exp, treat as non-expiring
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

// Get user data from localStorage
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

// Get token from localStorage
export function getToken() {
  return localStorage.getItem('token');
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getToken();
}

// Check if user is admin
export function isAdmin() {
  return getUser()?.userRole === 'Admin';
}

// Logout function
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Get user name
export function getUserName() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.userName || 'User';
  } catch {
    return 'User';
  }
}

// Get user ID
export function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.userId || null;
  } catch {
    return null;
  }
} 