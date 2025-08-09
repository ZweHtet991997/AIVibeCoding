import React, { useState, useRef, useEffect } from 'react';
import { chatbotAPI, chatbotErrorHandler, chatbotSession } from '../utils/chatbotAPI';

const BOT_NAME = 'BIM Bot';
const BOT_AVATAR = (
  <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md border border-white/20">
    <img
      src="/assets/images/robot-assistant.png"
      alt="BIM Bot Avatar"
      className="w-6 h-6 object-contain"
    />
  </div>
);
const USER_AVATAR = (
  <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md border border-white/20">
    <img
      src="/assets/images/user.png"
      alt="User Avatar"
      className="w-6 h-6 object-contain"
    />
  </div>
);

const initialBotMessage = {
  sender: 'bot',
  text: 'Hi! I\'m BIM Bot, your Admin Dashboard assistant. How can I assist you today?'
};

const BIMBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([initialBotMessage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(true);
  const chatBodyRef = useRef(null);

  // Initialize session and load conversation history
  useEffect(() => {
    const newSessionId = chatbotSession.generateSessionId();
    setSessionId(newSessionId);
    
    // Load existing conversation from session storage
    const savedMessages = chatbotSession.loadConversation(newSessionId);
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }

    // Validate API key on component mount
    validateAPIKey();
  }, []);

  // Validate OpenRouter API key
  const validateAPIKey = async () => {
    try {
      const isValid = await chatbotAPI.validateAPIKey();
      setApiKeyValid(isValid);
      if (!isValid) {
        setError('Chatbot API key is invalid. Please contact your administrator.');
      }
    } catch (error) {
      setApiKeyValid(false);
      setError('Unable to validate chatbot configuration.');
    }
  };

  // Save conversation to session storage whenever messages change
  useEffect(() => {
    if (sessionId) {
      chatbotSession.saveConversation(sessionId, messages);
    }
  }, [messages, sessionId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || loading || !apiKeyValid) return;
    
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Get conversation context (last 10 messages for context)
      const conversationHistory = chatbotAPI.getConversationContext(messages, 10);
      
      // Send message to OpenRouter API
      const response = await chatbotAPI.sendMessage(input, conversationHistory);
            
      // Add bot response to messages
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: response.text 
      }]);

    } catch (error) {      
      // Handle different types of errors
      const errorInfo = chatbotErrorHandler.handleError(error);
      setError(errorInfo.message);
      
      // Add user-friendly error message to chat
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: errorInfo.userMessage 
      }]);
      
      // If it's a configuration error, mark API as invalid
      if (errorInfo.type === 'configuration') {
        setApiKeyValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clear conversation
  const handleClearConversation = () => {
    setMessages([initialBotMessage]);
    if (sessionId) {
      chatbotSession.clearConversation(sessionId);
    }
    setError('');
  };

  // Retry last message (if there was an error)
  const handleRetry = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages[messages.length - 2];
    if (lastUserMessage.sender === 'user') {
      setInput(lastUserMessage.text);
      // Remove the last bot message (error message) and retry
      setMessages(prev => prev.slice(0, -1));
      // Small delay to ensure state updates
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  // Floating button
  if (!open) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 glass-card rounded-full p-2 hover:neon-soft transition-all duration-300 animate-fade-in"
        onClick={() => setOpen(true)}
        aria-label="Open BIM Bot"
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src="/assets/images/robot-assistant.png"
            alt="Open BIM Bot"
            className="w-8 h-8 object-contain"
          />
        </div>
        {!apiKeyValid && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-1/3 max-w-[95vw] animate-fade-in">
      <div className="relative">
        {/* Glassmorphism style */}
        <div className="glass-card soft-bg rounded-2xl shadow-lg flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-white/10 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center shadow-md">
                <img
                  src="/assets/images/robot-assistant.png"
                  alt="BIM Bot"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-gray-800 text-lg">{BOT_NAME}</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${apiKeyValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-600">{apiKeyValid ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="glass-button rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300" 
                onClick={handleClearConversation}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button 
                className="glass-button rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300" 
                onClick={() => setOpen(false)} 
                aria-label="Close BIM Bot"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Error Banner */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-600">{error}</span>
                {chatbotErrorHandler.isRetryable(new Error(error)) && (
                  <button
                    onClick={handleRetry}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Chat body */}
          <div ref={chatBodyRef} className="flex-1 px-4 py-3 space-y-3 overflow-y-auto max-h-80">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0 mt-1">
                    {msg.sender === 'bot' ? BOT_AVATAR : USER_AVATAR}
                  </div>
                  <div className={`rounded-xl px-4 py-2 text-sm shadow-md ${
                    msg.sender === 'bot' 
                      ? 'bg-white/90 backdrop-blur-md border border-white/20 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
                  } ${msg.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="flex-shrink-0 mt-1">
                    {BOT_AVATAR}
                  </div>
                  <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 text-sm shadow-md border border-white/20 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-600">BIM Bot is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="px-4 py-2 border-t border-white/10 bg-white/50 flex items-center gap-3">
            <input
              className="flex-1 glass-input rounded-xl px-4 py-2 text-sm focus:outline-none transition-all duration-300"
              type="text"
              placeholder={apiKeyValid ? "Type your message..." : "Chatbot is offline"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || !apiKeyValid}
            />
            <button
              className={`rounded-xl px-4 py-2 font-medium shadow-md transition-all duration-300 ${
                loading || !input.trim() || !apiKeyValid
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 hover:neon-soft text-white'
              }`}
              onClick={handleSend}
              disabled={loading || !input.trim() || !apiKeyValid}
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BIMBot; 