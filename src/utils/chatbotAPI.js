// Chatbot API integration with OpenRouter
import apiConfig from '../config';
import { chatbotConfig, knowledgeBaseConfig, sessionConfig } from '../config/chatbot';

// Knowledge base content (will be loaded from external file)
let KNOWLEDGE_BASE = '';

// System prompt for the chatbot
const getSystemPrompt = () => `You are ${chatbotConfig.ui.botName}, a helpful AI assistant for the Admin Dashboard system. You have access to comprehensive documentation about the system and should use it to provide accurate, helpful answers to user questions.

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
  // Initialize knowledge base
  async initialize() {
    try {
      if (knowledgeBaseConfig.source !== 'embedded') {
        await this.loadKnowledgeBase();
      }
    } catch (error) {
      console.error('Failed to initialize knowledge base:', error);
    }
  },

  // Send message to OpenRouter API
  async sendMessage(message, conversationHistory = []) {
    try {
      // Check if API key is properly configured
      if (!chatbotConfig.openRouter.apiKey) {
        throw new Error('API key not configured. Please set your OpenRouter API key.');
      }

      // Ensure knowledge base is loaded
      if (knowledgeBaseConfig.source !== 'embedded' && !KNOWLEDGE_BASE) {
        await this.loadKnowledgeBase();
      }

      // Prepare conversation context
      const messages = [
        {
          role: 'system',
          content: getSystemPrompt()
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

  // Load knowledge base from external file
  async loadKnowledgeBase() {
    try {
      if (knowledgeBaseConfig.source === 'file') {
        const response = await fetch(knowledgeBaseConfig.filePath);
        if (!response.ok) {
          throw new Error(`Failed to load knowledge base file: ${response.status} ${response.statusText}`);
        }
        const content = await response.text();
        KNOWLEDGE_BASE = content; // Update the global knowledge base variable
        return content;
      } else if (knowledgeBaseConfig.source === 'api') {
        const response = await fetch(knowledgeBaseConfig.apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to load knowledge base from API: ${response.status} ${response.statusText}`);
        }
        const content = await response.text();
        KNOWLEDGE_BASE = content;
        return content;
      } else {
        // Default to embedded knowledge base
        return KNOWLEDGE_BASE;
      }
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
      // Return a fallback message if knowledge base loading fails
      const fallbackContent = '# Admin Dashboard Support Guide\n\nI apologize, but I\'m currently unable to load the complete knowledge base. Please contact your system administrator to check the chatbot configuration.';
      KNOWLEDGE_BASE = fallbackContent;
      return fallbackContent;
    }
  },
  // Reload knowledge base from file
  async reloadKnowledgeBase() {
    try {
      await this.loadKnowledgeBase();
      return true;
    } catch (error) {
      console.error('Failed to reload knowledge base:', error);
      return false;
    }
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

// Initialize knowledge base when module is loaded
chatbotAPI.initialize().catch(error => {
  console.error('Failed to initialize chatbot knowledge base:', error);
}); 