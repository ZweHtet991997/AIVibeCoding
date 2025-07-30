const apiConfig = {
  // Set your backend API base URL here. You can use an environment variable or edit directly for now.
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  // Set your frontend base URL here. You can use an environment variable or edit directly for now.
  frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
};

export default apiConfig; 