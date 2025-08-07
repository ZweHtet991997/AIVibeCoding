// Chatbot Configuration
export const chatbotConfig = {
  // OpenRouter API Configuration
  openRouter: {
    apiKey: process.env.REACT_APP_OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    //model: 'anthropic/claude-3.5-sonnet',
    model: 'tngtech/deepseek-r1t2-chimera:free', // Free model with good Burmese support
    maxTokens: 1000,
    temperature: 0.7,
    stream: false
  },

  // Chatbot Behavior Settings
  behavior: {
    maxContextMessages: 10, // Number of previous messages to include in context
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // UI Settings
  ui: {
    botName: 'BIM Bot',
    botAvatar: '/assets/images/robot-assistant.png',
    userAvatar: '/assets/images/user.png',
    welcomeMessage: 'Hi! I\'m BIM Bot, your Admin Dashboard assistant. I can help you with questions about forms, approvals, user management, and troubleshooting. How can I assist you today?',
    placeholderText: 'Type your message...',
    offlinePlaceholderText: 'Chatbot is offline',
    thinkingText: 'BIM Bot is thinking...',
    typingText: 'BIM Bot is typing...'
  },

  // Error Messages
  errors: {
    apiKeyInvalid: 'Chatbot API key is invalid. Please contact your administrator.',
    configurationError: 'Unable to validate chatbot configuration.',
    networkError: 'I\'m having trouble connecting to the internet. Please check your connection and try again.',
    rateLimitError: 'I\'m receiving too many requests right now. Please wait a moment and try again.',
    generalError: 'I encountered an unexpected error. Please try again, and if the problem persists, contact your system administrator.',
    knowledgeBaseError: 'I\'m having trouble connecting to my knowledge base. Please contact your system administrator to check the chatbot configuration.'
  }
};

// Knowledge base configuration
export const knowledgeBaseConfig = {
  // Source of knowledge base content
  source: 'file', // 'embedded', 'file', or 'api'
  
  // File path if using file source
  filePath: '/ADMIN_DASHBOARD_CHATBOT_DOCUMENTATION.md',
  
  // API endpoint if using api source
  apiEndpoint: '/api/chatbot/knowledge-base',
  
  // Update frequency (in milliseconds) - 0 means no auto-update
  updateFrequency: 0,
  
  // Cache settings
  cache: {
    enabled: true,
    duration: 60 * 60 * 1000, // 1 hour
  }
};

// Session management configuration
export const sessionConfig = {
  // Storage type: 'sessionStorage', 'localStorage', or 'memory'
  storageType: 'sessionStorage',
  
  // Session prefix for storage keys
  keyPrefix: 'chatbot_session_',
  
  // Maximum session duration
  maxDuration: 24 * 60 * 60 * 1000, // 24 hours
  
  // Auto-cleanup old sessions
  autoCleanup: true,
  
  // Cleanup interval (in milliseconds)
  cleanupInterval: 60 * 60 * 1000, // 1 hour
};

// Feature flags
export const featureFlags = {
  // Enable/disable specific features
  sessionManagement: true,
  errorRetry: true,
  conversationHistory: true,
  apiKeyValidation: true,
  knowledgeBaseUpdates: false,
  analytics: false,
  voiceInput: false,
  fileUpload: false
}; 