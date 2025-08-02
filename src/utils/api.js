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

  // Create new form
  async createForm(formData) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Creating form with data:', formData);

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/createform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `Failed to create form: ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }

        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 400) {
          throw new Error(errorMessage);
        } else if (response.status === 409) {
          throw new Error(`Form creation conflict: ${errorMessage}. This might be due to a duplicate form name or ID.`);
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('Form created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating form:', error);
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing user from form:', error);
      throw error;
    }
  },

  // Activate form (change status from Draft to Active)
  async activateForm(formId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/form/activate?formId=${formId}`, {
        method: 'PATCH',
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
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid form data');
        } else {
          throw new Error(`Failed to activate form: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error activating form:', error);
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
  },

  // Approve or reject a form response
  async approveRejectForm(responseId, status, comment = '') {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate input parameters
      if (!responseId) {
        throw new Error('Response ID is required');
      }
      
      // Ensure responseId is a number
      const numericResponseId = parseInt(responseId);
      if (isNaN(numericResponseId)) {
        throw new Error('Response ID must be a valid number');
      }
      
      if (!status || !['Approved', 'Rejected'].includes(status)) {
        throw new Error('Status must be either "Approved" or "Rejected"');
      }

      // Prepare request payload - try different formats
      const requestPayload = {
        responseId: numericResponseId,
        status: status,
        comment: comment || ''
      };

      // Alternative payload format if the above doesn't work
      const alternativePayload = {
        responseId: numericResponseId,
        status: status,
        comment: comment || '',
        // Add any additional fields that might be expected
        timestamp: new Date().toISOString()
      };

      console.log('API Request Details:', {
        url: `${apiConfig.baseUrl}/api/v1/form/approve-reject`,
        method: 'POST',
        payload: requestPayload,
        token: token ? `${token.substring(0, 20)}...` : 'No token'
      });

      // Try the primary request format
      let response = await fetch(`${apiConfig.baseUrl}/api/v1/form/approve-reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestPayload)
      });

      // If the first attempt fails with 500, try alternative format
      if (response.status === 500) {
        console.log('Primary request failed with 500, trying alternative format...');
        response = await fetch(`${apiConfig.baseUrl}/api/v1/form/approve-reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(alternativePayload)
        });
      }

      console.log('API Response Details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        let errorMessage = `Failed to ${status.toLowerCase()} form response: ${response.status}`;
        
        // Try to get detailed error message from response
        try {
          const errorData = await response.json();
          console.log('Error response data:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }

        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('Form response not found.');
        } else if (response.status === 400) {
          throw new Error(errorMessage);
        } else if (response.status === 409) {
          throw new Error('This form response has already been processed.');
        } else if (response.status === 500) {
          throw new Error(`Server error: ${errorMessage}. Please try again or contact support.`);
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      return data;
    } catch (error) {
      console.error(`Error ${status.toLowerCase()}ing form response:`, error);
      throw error;
    }
  }
};

// API service for user forms operations
export const userFormsAPI = {
  // Fetch assigned forms for the current user
  async getAssignedForms(userId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = `${apiConfig.baseUrl}/api/v1/user/assigned?userId=${userId}`;

      const response = await fetch(url, {
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
          throw new Error('No assigned forms found.');
        } else {
          throw new Error(`Failed to fetch assigned forms: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching assigned forms:', error);
      throw error;
    }
  },

  // Fetch form details for filling
  async getFormDetails(userId, formId) {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/v1/user/form-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          formId: formId
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. User privileges required.');
        } else if (response.status === 404) {
          throw new Error('Form not found or not assigned to you.');
        } else {
          throw new Error(`Failed to fetch form details: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching form details:', error);
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
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  }
}; 