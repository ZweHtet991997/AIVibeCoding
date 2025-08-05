// Chatbot API integration with OpenRouter
import apiConfig from '../config';
import { chatbotConfig, knowledgeBaseConfig, sessionConfig } from '../config/chatbot';

// Knowledge base content (this will be loaded from the documentation)
const KNOWLEDGE_BASE = `
# Admin Dashboard Support Guide

## Dashboard Overview
The main dashboard provides a comprehensive view of your form management system with key metrics and statistics.

**Key Features:**
- **Summary Cards**: Display total forms created, submissions received, pending approvals, and approval statistics
- **Statistics Charts**: Visual representation of form submission trends and approval status distribution
- **Recent Submissions Table**: Quick view of the latest form submissions requiring attention

## Forms Management
The Forms section is where you create, manage, and publish forms for your organization.

**Key Features:**
- **Form Creation**: Build custom forms using a drag-and-drop interface
- **Form Publishing**: Activate forms to make them available for users
- **User Assignment**: Assign specific users to fill out particular forms
- **Status Management**: Track forms as Draft, Active, or Inactive

## Approvals Management
The Approvals section handles the review and approval process for submitted forms.

**Key Features:**
- **Submission Review**: View all submitted forms with their current status
- **Status Filtering**: Filter submissions by Pending, Approved, or Rejected status
- **Detailed View**: Access complete submission details for thorough review
- **Approval Actions**: Approve or reject submissions with comments

## User Management
The Users section provides oversight of all system users and their form assignments.

**Key Features:**
- **User Directory**: View all registered users with their roles and status
- **Assignment Tracking**: See how many forms each user is assigned
- **Status Monitoring**: Track user activity status (Active/Inactive)
- **Search and Filter**: Quickly find specific users or filter by status

## How to Use Each Part of the Dashboard

### Dashboard Overview
1. **Access the Dashboard**: Log in with your admin credentials
2. **Review Key Metrics**: Check the summary cards for quick insights
3. **Navigate Recent Submissions**: Click on any submission in the recent submissions table

### Creating and Managing Forms
1. **Create a New Form**: Navigate to the "Forms" section and click "+ Create New Form"
2. **Assign Users to Forms**: In the Forms table, click "Assign Users" for your form
3. **Publish a Form**: Select the form and click the "Publish" button

### Managing Approvals
1. **Access Submissions**: Navigate to the "Approvals" section
2. **Filter Submissions**: Use the search box and status dropdown
3. **Review Submissions**: Click the "View" button next to any submission
4. **Take Action**: Approve or reject the submission with comments

### Managing Users
1. **View User Directory**: Navigate to the "Users" section
2. **Search and Filter Users**: Use the search box to find specific users
3. **Monitor User Activity**: Check user status and form assignments

## User Roles and Permissions

### Admin Role
**Full system access with all capabilities:**
- Access to all dashboard sections
- Create, edit, and delete forms
- Assign users to forms
- Publish and unpublish forms
- Review and approve/reject all submissions
- View all user information and statistics

### Normal User Role
**Limited access focused on form completion:**
- View assigned forms only
- Fill out and submit assigned forms
- View own submission history
- Receive notifications about form assignments

## Common Error Messages and Solutions

**"Admin privileges required to view dashboard data"**
- **Cause**: Your account doesn't have admin role permissions
- **Solution**: Contact your system administrator to verify your role assignment

**"Failed to load forms. Please try again."**
- **Cause**: Network connectivity issues or server problems
- **Solution**: Check your internet connection and try refreshing the page

**"Failed to save assignments"**
- **Cause**: Server communication error or invalid user/form data
- **Solution**: Verify the form and users exist, then try again

## Frequently Asked Questions

**Q: How do I access the admin dashboard?**
A: Log in with your admin credentials. The system will automatically redirect you to the admin dashboard if you have admin privileges.

**Q: How do I create a new form?**
A: Go to the Forms section and click "+ Create New Form". Use the drag-and-drop builder to design your form, then save it as a draft.

**Q: What's the difference between Draft and Active forms?**
A: Draft forms are still being created and aren't available to users. Active forms are published and can be filled out by assigned users.

**Q: How do I assign users to a form?**
A: In the Forms table, click "Assign Users" next to the form. Search for users and check the boxes for those who should have access.

**Q: How do I know when there are new submissions to review?**
A: Check the "Total Pending Approvals" card on the dashboard and the Approvals section for new submissions.

**Q: What should I consider when approving or rejecting a submission?**
A: Review all form data carefully, check for completeness and accuracy, and ensure it meets your organization's requirements.

**Q: How long should I take to review submissions?**
A: Aim to review submissions within 24-48 hours to maintain workflow efficiency.

**Q: How do I see which users are assigned to which forms?**
A: Go to the Users section to see total assignments per user, or check individual forms in the Forms section.

**Q: What does "Inactive" user status mean?**
A: Inactive users cannot access the system or fill out forms. This status is typically used for users who have left the organization.

## UI Walkthroughs

### Dashboard Layout Overview
- **Left Sidebar**: Contains navigation menu with Dashboard, Forms, Approvals, and Users sections
- **Top Header**: Shows current section name and welcome message
- **Main Content Area**: Displays the selected section's content
- **Collapsible Sidebar**: Can be minimized to save screen space

### Forms Section Interface
- **Search Bar**: Filter forms by name
- **Status Filter**: Dropdown to filter by Draft, Active, or Inactive
- **Create Button**: Blue "+ Create New Form" button in the top right
- **Action Buttons**: Assign Users and Publish buttons for each form

### Approvals Section Interface
- **Search Bar**: Filter by form name
- **Status Filter**: Dropdown for Pending, Approved, Rejected
- **Submission Details**: ID, form name, submitter, date, status
- **View Button**: Access detailed submission information

### Users Section Interface
- **Search Bar**: Find users by name or email
- **Status Filter**: Filter by Active or Inactive status
- **User Information**: Username, email, role, form assignments, status
- **Status Indicators**: Color-coded status badges
`;

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are ${chatbotConfig.ui.botName}, a helpful AI assistant for the Admin Dashboard system. You have access to comprehensive documentation about the system and should use it to provide accurate, helpful answers to user questions.

Your role is to:
1. Help users understand how to use the Admin Dashboard effectively
2. Provide step-by-step instructions for common tasks
3. Explain features and functionality clearly
4. Troubleshoot common issues and errors
5. Answer questions about user roles and permissions
6. Guide users through the UI and navigation

Always be:
- Friendly and helpful in your tone
- Specific and actionable in your responses
- Accurate based on the provided documentation
- Clear and concise in your explanations

Use the knowledge base provided to answer questions. If a user asks about something not covered in the documentation, politely let them know and suggest they contact their system administrator or technical support.

Current knowledge base context:
${KNOWLEDGE_BASE}

Remember to maintain context throughout the conversation and provide relevant, helpful responses.`;

// Chatbot API service
export const chatbotAPI = {
  // Send message to OpenRouter API
  async sendMessage(message, conversationHistory = []) {
    try {
      // Check if API key is properly configured
      if (!chatbotConfig.openRouter.apiKey) {
        throw new Error('API key not configured. Please set your OpenRouter API key.');
      }

      // Prepare conversation context
      const messages = [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...conversationHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch(`${chatbotConfig.openRouter.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${chatbotConfig.openRouter.apiKey}`,
          'HTTP-Referer': apiConfig.frontendUrl,
          'X-Title': `${chatbotConfig.ui.botName} Admin Dashboard Chatbot`
        },
        body: JSON.stringify({
          model: chatbotConfig.openRouter.model,
          messages: messages,
          max_tokens: chatbotConfig.openRouter.maxTokens,
          temperature: chatbotConfig.openRouter.temperature,
          stream: chatbotConfig.openRouter.stream
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter configuration.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 400) {
          throw new Error(errorData.error?.message || 'Invalid request to AI service.');
        } else {
          throw new Error(`AI service error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from AI service.');
      }

      return {
        text: data.choices[0].message.content,
        usage: data.usage
      };

    } catch (error) {
      console.error('Chatbot API error:', error);
      throw error;
    }
  },

  // Load knowledge base from external file (optional)
  async loadKnowledgeBase() {
    try {
      if (knowledgeBaseConfig.source === 'file') {
        const response = await fetch(knowledgeBaseConfig.filePath);
        const content = await response.text();
        return content;
      } else if (knowledgeBaseConfig.source === 'api') {
        const response = await fetch(knowledgeBaseConfig.apiEndpoint);
        const content = await response.text();
        return content;
      } else {
        // Default to embedded knowledge base
        return KNOWLEDGE_BASE;
      }
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
      return KNOWLEDGE_BASE; // Fallback to embedded version
    }
  },

  // Update knowledge base content
  updateKnowledgeBase(newContent) {
    // This could be used to dynamically update the knowledge base
    // For now, we're using the static embedded version
    console.log('Knowledge base update requested:', newContent);
  },

  // Get conversation context for better responses
  getConversationContext(history, maxMessages = null) {
    const maxContext = maxMessages || chatbotConfig.behavior.maxContextMessages;
    // Return the last N messages for context
    return history.slice(-maxContext);
  },

  // Validate API key
  async validateAPIKey() {
    try {
      // Check if API key is properly configured
      if (!chatbotConfig.openRouter.apiKey) {
        return false;
      }

      const response = await fetch(`${chatbotConfig.openRouter.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${chatbotConfig.openRouter.apiKey}`,
          'HTTP-Referer': apiConfig.frontendUrl,
          'X-Title': `${chatbotConfig.ui.botName} Admin Dashboard Chatbot`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }
};

// Error handling utilities
export const chatbotErrorHandler = {
  // Handle different types of errors
  handleError(error) {
    if (error.message.includes('API key not configured') || error.message.includes('API key')) {
      return {
        type: 'configuration',
        message: 'Chatbot API key is not configured. Please set your OpenRouter API key in the environment variables.',
        userMessage: 'I\'m not properly configured yet. Please contact your system administrator to set up the chatbot API key.'
      };
    } else if (error.message.includes('Rate limit')) {
      return {
        type: 'rate_limit',
        message: chatbotConfig.errors.rateLimitError,
        userMessage: chatbotConfig.errors.rateLimitError
      };
    } else if (error.message.includes('Network')) {
      return {
        type: 'network',
        message: chatbotConfig.errors.networkError,
        userMessage: chatbotConfig.errors.networkError
      };
    } else {
      return {
        type: 'general',
        message: chatbotConfig.errors.generalError,
        userMessage: chatbotConfig.errors.generalError
      };
    }
  },

  // Check if error is retryable
  isRetryable(error) {
    return error.message.includes('Rate limit') || 
           error.message.includes('Network') ||
           error.message.includes('timeout');
  }
};

// Session management for conversation context
export const chatbotSession = {
  // Store conversation history in session storage
  saveConversation(sessionId, messages) {
    try {
      const storageKey = `${sessionConfig.keyPrefix}${sessionId}`;
      const storageData = {
        messages,
        timestamp: Date.now(),
        expiresAt: Date.now() + sessionConfig.maxDuration
      };
      
      if (sessionConfig.storageType === 'sessionStorage') {
        sessionStorage.setItem(storageKey, JSON.stringify(storageData));
      } else if (sessionConfig.storageType === 'localStorage') {
        localStorage.setItem(storageKey, JSON.stringify(storageData));
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  },

  // Load conversation history from session storage
  loadConversation(sessionId) {
    try {
      const storageKey = `${sessionConfig.keyPrefix}${sessionId}`;
      let stored = null;
      
      if (sessionConfig.storageType === 'sessionStorage') {
        stored = sessionStorage.getItem(storageKey);
      } else if (sessionConfig.storageType === 'localStorage') {
        stored = localStorage.getItem(storageKey);
      }
      
      if (stored) {
        const data = JSON.parse(stored);
        
        // Check if session has expired
        if (data.expiresAt && Date.now() > data.expiresAt) {
          this.clearConversation(sessionId);
          return [];
        }
        
        return data.messages || [];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return [];
    }
  },

  // Clear conversation history
  clearConversation(sessionId) {
    try {
      const storageKey = `${sessionConfig.keyPrefix}${sessionId}`;
      
      if (sessionConfig.storageType === 'sessionStorage') {
        sessionStorage.removeItem(storageKey);
      } else if (sessionConfig.storageType === 'localStorage') {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  },

  // Generate session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Cleanup expired sessions
  cleanupExpiredSessions() {
    if (!sessionConfig.autoCleanup) return;
    
    try {
      const storage = sessionConfig.storageType === 'sessionStorage' ? sessionStorage : localStorage;
      const keys = Object.keys(storage);
      
      keys.forEach(key => {
        if (key.startsWith(sessionConfig.keyPrefix)) {
          try {
            const data = JSON.parse(storage.getItem(key));
            if (data.expiresAt && Date.now() > data.expiresAt) {
              storage.removeItem(key);
            }
          } catch (error) {
            // Invalid data, remove it
            storage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
    }
  }
};

// Initialize cleanup interval if auto-cleanup is enabled
if (sessionConfig.autoCleanup && sessionConfig.cleanupInterval > 0) {
  setInterval(() => {
    chatbotSession.cleanupExpiredSessions();
  }, sessionConfig.cleanupInterval);
} 