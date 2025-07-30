import React, { useState, useRef, useEffect } from 'react';

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
  text: 'Hi! I\'m BIM Bot. How can I assist you today?'
};

const BIMBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([initialBotMessage]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatBodyRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (open && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Handle send
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError('');
    try {
      // Simulate API call delay
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'This feature is not yet implemented.' }]);
        setLoading(false);
      }, 1000);
    } catch {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Something went wrong. Please try again.' }]);
      setError('API error');
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSend();
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
      </button>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[95vw] animate-fade-in">
      <div className="relative">
        {/* Glassmorphism style */}
        <div className="glass-card rounded-2xl shadow-lg flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/50">
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
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Online</span>
                </div>
              </div>
            </div>
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
          
          {/* Chat body */}
          <div ref={chatBodyRef} className="flex-1 px-4 py-3 space-y-3 overflow-y-auto max-h-80">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.sender === 'bot' ? BOT_AVATAR : USER_AVATAR}
                  <div className={`rounded-xl px-4 py-2 text-sm shadow-md ${
                    msg.sender === 'bot' 
                      ? 'bg-white/90 backdrop-blur-md border border-white/20 text-gray-800' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
                  } ${msg.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[80%]">
                  {BOT_AVATAR}
                  <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 text-sm shadow-md border border-white/20 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-gray-600">BIM Bot is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input */}
          <div className="px-4 py-3 border-t border-white/10 bg-white/50 flex items-center gap-3">
            <input
              className="flex-1 glass-input rounded-xl px-4 py-2 text-sm focus:outline-none transition-all duration-300"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className={`rounded-xl px-4 py-2 font-medium shadow-md transition-all duration-300 ${
                loading || !input.trim()
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 hover:neon-soft text-white'
              }`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
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