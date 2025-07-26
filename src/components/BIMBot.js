import React, { useState, useRef, useEffect } from 'react';

const BOT_NAME = 'BIM Bot';
const BOT_AVATAR = (
  <img
    src="/assets/images/robot-assistant.png"
    alt="BIM Bot Avatar"
    className="w-8 h-8 rounded-full shadow-md bg-white object-contain"
    style={{ background: 'rgba(255,255,255,0.7)' }}
  />
);
const USER_AVATAR = (
    <img
    src="/assets/images/user.png"
    alt="BIM Bot Avatar"
    className="w-8 h-8 rounded-full shadow-md bg-white object-contain"
    style={{ background: 'rgba(255,255,255,0.7)' }}
  />
);

const initialBotMessage = {
  sender: 'bot',
  text: 'Hi! I’m BIM Bot. How can I assist you today?'
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
        className="fixed bottom-6 right-6 z-50 bg-white bg-opacity-70 backdrop-blur-md shadow-xl rounded-full p-0.5 flex items-center justify-center border border-gray-200 hover:scale-105 transition-transform duration-200"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
        onClick={() => setOpen(true)}
        aria-label="Open BIM Bot"
      >
        <span className="w-14 h-14 flex items-center justify-center">
          <img
            src="/assets/images/robot-assistant.png"
            alt="Open BIM Bot"
            className="w-10 h-10 object-contain"
          />
        </span>
      </button>
    );
  }

  // Chat window
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[95vw]">
      <div className="relative">
        {/* Glassmorphism/neumorphism style */}
        <div className="rounded-2xl shadow-2xl bg-white bg-opacity-80 backdrop-blur-md border border-gray-200 flex flex-col overflow-hidden animate-fadeInUp" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100 bg-white bg-opacity-60">
            <div className="flex items-center gap-2">
            <span className="w-12 h-12 flex items-center justify-center">
          <img
            src="/assets/images/robot-assistant.png"
            alt="Open BIM Bot"
            className="w-9 h-9 object-contain"
          />
        </span>
              <span className="font-bold text-dashboard-bodyText text-md tracking-tight drop-shadow-sm">{BOT_NAME}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setOpen(false)} aria-label="Close BIM Bot">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Chat body */}
          <div ref={chatBodyRef} className="flex-1 px-4 py-3 space-y-3 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.sender === 'bot' ? BOT_AVATAR : USER_AVATAR}
                  <div className={`rounded-xl px-4 py-2 text-sm shadow ${msg.sender === 'bot' ? 'bg-white bg-opacity-80 text-gray-800 border border-blue-100' : 'bg-blue-500 text-white'} ${msg.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>{msg.text}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[80%]">
                  {BOT_AVATAR}
                  <div className="rounded-xl px-4 py-2 text-sm shadow bg-white bg-opacity-80 text-gray-400 border border-blue-100 animate-pulse">BIM Bot is typing…</div>
                </div>
              </div>
            )}
          </div>
          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white bg-opacity-60 flex items-center gap-2">
            <input
              className="flex-1 rounded-lg px-3 py-2 border border-gray-200 bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm shadow-sm"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold shadow transition-colors disabled:opacity-50"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px) scale(0.98); } to { opacity: 1; transform: none; } }
          .animate-fadeInUp { animation: fadeInUp 0.25s cubic-bezier(0.4,0,0.2,1); }
        `}</style>
      </div>
    </div>
  );
};

export default BIMBot; 