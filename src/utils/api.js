import apiConfig from '../config';
import { getToken } from './auth';

// API service for dashboard operations
export const dashboardAPI = {
  // Fetch admin dashboard data
  async getDashboardData() {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};

// API service for forms operations
export const formsAPI = {
  // Fetch admin forms list
  async getFormsList() {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/formlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch forms data: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching forms data:', error);
      throw error;
    }
  },

  // Save form (create or update)
  async saveForm(formData) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id 
        ? `${apiConfig.baseUrl}/api/v1/form/${formData.id}`
        : `${apiConfig.baseUrl}/api/v1/form`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid form data');
        } else {
          throw new Error(`Failed to save form: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving form:', error);
      throw error;
    }
  },

  // Get form by ID for editing
  async getFormById(formId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/${formId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('Form not found.');
        } else {
          throw new Error(`Failed to fetch form: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  },

  // Fetch form assignments for a specific form
  async getFormAssignments(formId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/${formId}/assignments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch form assignments: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching form assignments:', error);
      throw error;
    }
  },

  // Assign user to form
  async assignUserToForm(formId, userId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/assignform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          formId: formId,
          userId: userId
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to assign user to form: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error assigning user to form:', error);
      throw error;
    }
  },

  // Remove user from form
  async removeUserFromForm(formId, userId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/removeassign?formId=${formId}&userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to remove user from form: ${response.status}`);
        }
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      console.log('Remove user response status:', response.status);
      console.log('Remove user response content-type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        // For successful DELETE operations that don't return JSON
        return { success: true, message: 'User removed from form successfully' };
      }
    } catch (error) {
      console.error('Error removing user from form:', error);
      throw error;
    }
  }
};

// API service for user operations
export const userAPI = {
  // Fetch admin user list
  async getUserList() {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/admin/userlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch user list: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user list:', error);
      throw error;
    }
  }
};

// API service for approvals operations
export const approvalsAPI = {
  // Fetch form responses for approvals
  async getFormResponses() {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/formresponse`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else {
          throw new Error(`Failed to fetch form responses: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching form responses:', error);
      throw error;
    }
  }
};

// API service for user forms operations
export const userFormsAPI = {
  // Fetch assigned forms for the current user
  async getAssignedForms() {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // For demo purposes, return sample data
      // TODO: Replace with actual API call when backend is ready
      const { getAssignedForms } = await import('./sampleFormData');
      return getAssignedForms();

      // Uncomment when backend is ready:
      /*
      const response = await fetch(`${apiConfig.baseUrl}/api/v1/user/assigned-forms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. User privileges required.');
        } else {
          throw new Error(`Failed to fetch assigned forms: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error('Error fetching assigned forms:', error);
      throw error;
    }
  },

  // Fetch a specific form by ID for filling
  async getFormById(formId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // For demo purposes, return sample data
      // TODO: Replace with actual API call when backend is ready
      const { getFormById } = await import('./sampleFormData');
      const form = getFormById(formId);
      
      if (!form) {
        throw new Error('Form not found or not assigned to you.');
      }
      
      return form;

      // Uncomment when backend is ready:
      /*
      const response = await fetch(`${apiConfig.baseUrl}/api/v1/user/form/${formId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. User privileges required.');
        } else if (response.status === 404) {
          throw new Error('Form not found or not assigned to you.');
        } else {
          throw new Error(`Failed to fetch form: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  },

  // Submit form response
  async submitFormResponse(formId, formData) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // For demo purposes, simulate successful submission
      // TODO: Replace with actual API call when backend is ready
      console.log('Form submission data:', { formId, formData });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, message: 'Form submitted successfully' };

      // Uncomment when backend is ready:
      /*
      const response = await fetch(`${apiConfig.baseUrl}/api/v1/user/form/${formId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. User privileges required.');
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid form data');
        } else {
          throw new Error(`Failed to submit form: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
      */
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  }
}; 