import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiConfig from '../config';
import { isTokenExpired, getUser } from '../utils/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [animationStep, setAnimationStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // Animation sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is already authenticated and redirect if so
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = getUser();
    
    if (token && user && !isTokenExpired(token)) {
      try {
        if (user.userRole === 'Admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-home');
        }
      } catch (error) {
        // If user data is corrupted, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Caps Lock detection for password field
  const handlePasswordKeyUp = (e) => {
    setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/v1/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      const data = await response.json();
      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        userName: data.userName,
        userRole: data.userRole,
        email: data.email,
      }));
      // Navigate based on role
      if (data.userRole === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-home');
      }
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full soft-bg flex">
      {/* Left Panel - Login Form (modern glass card) */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16">
        <div className="w-full max-w-xl">
          {/* Card */}
          <div className="p-8 rounded-2xl">
            {/* Branding */}
            <div className="flex items-center mb-3">
              <div className="w-20 h-20 mr-3  flex items-center justify-center">
                <img
                  src="/assets/images/BIM.png"
                  alt="BIM Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-serif text-black">GROUP OF COMPANIES</span>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-8">
              <p className="text-gray-600">Manage your forms effortlessly with AI-powered chatbot support and built-in spam detection.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className={`relative`}> 
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.94 6.34L10 10.88l7.06-4.54A2 2 0 0015.5 4h-11a2 2 0 00-1.56 2.34z"/><path d="M18 8.12l-8 5.16-8-5.16V14a2 2 0 002 2h12a2 2 0 002-2V8.12z"/></svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-4 pr-4 py-3 rounded-xl glass-input border focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                      validationErrors.email ? 'border-red-400 focus:ring-red-300' : 'border-transparent'
                    }`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  {isCapsLockOn && (
                    <span className="text-xs text-amber-600">Caps Lock is on</span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v2H3a1 1 0 00-1 1v6a1 1 0 001 1h14a1 1 0 001-1v-6a1 1 0 00-1-1h-1V8a6 6 0 00-6-6zm4 8V8a4 4 0 10-8 0v2h8z" clipRule="evenodd"/></svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyUp={handlePasswordKeyUp}
                    className={`w-full pl-4 pr-15 py-3 rounded-xl glass-input border focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                      validationErrors.password ? 'border-red-400 focus:ring-red-300' : 'border-transparent'
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.64-1.49 1.62-2.86 2.82-4.04M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8-1 2.33-2.67 4.32-4.7 5.71M1 1l22 22"/></svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-soft ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 neon-soft'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Small footnote */}
            <p className="text-xs text-gray-600 mt-8">By signing in, you agree to our Terms and Privacy Policy.</p>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Animated Form Builder */}
      <div className="hidden lg:flex flex-1 soft-bg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Floating geometric shapes */}
          <div className="absolute top-8 left-8 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-16 right-12 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-16 left-12 w-20 h-20 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          
          {/* Main form builder interface */}
          <div className="relative z-10 w-96 h-[520px] bg-white rounded-2xl shadow-2xl p-6 transform rotate-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">Form Builder</span>
              </div>
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Toolbar */}
            <div className="flex space-x-2 mb-4">
              {['Text', 'Number', 'Select', 'Checkbox'].map((tool, index) => (
                <div
                  key={tool}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    animationStep === index
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tool}
                </div>
              ))}
            </div>
            
            {/* Form canvas */}
            <div className="bg-gray-50 rounded-lg p-4 h-80 relative overflow-hidden">
              {/* Dragging element */}
              {animationStep === 0 && (
                <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-lg border-2 border-dashed border-indigo-300 transform animate-bounce">
                  <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-gray-300 rounded mt-2 animate-pulse"></div>
                </div>
              )}
              
              {/* Form elements */}
              <div className="space-y-3">
                {/* Text field */}
                <div className={`bg-white rounded-lg p-3 shadow-sm transition-all duration-500 ${
                  animationStep === 0 ? 'transform translate-x-2 opacity-100' : 'opacity-60'
                }`}>
                  <div className="w-full h-8 bg-gray-100 rounded border-l-4 border-indigo-500"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded mt-2"></div>
                </div>
                
                {/* Email field */}
                <div className={`bg-white rounded-lg p-3 shadow-sm transition-all duration-500 ${
                  animationStep === 1 ? 'transform translate-x-2 opacity-100' : 'opacity-60'
                }`}>
                  <div className="w-full h-8 bg-gray-100 rounded border-l-4 border-purple-500"></div>
                  <div className="w-20 h-3 bg-gray-200 rounded mt-2"></div>
                </div>
                
                {/* Dropdown */}
                <div className={`bg-white rounded-lg p-3 shadow-sm transition-all duration-500 ${
                  animationStep === 2 ? 'transform translate-x-2 opacity-100' : 'opacity-60'
                }`}>
                  <div className="w-full h-8 bg-gray-100 rounded border-l-4 border-pink-500 flex items-center justify-between px-2">
                    <div className="w-16 h-3 bg-gray-300 rounded"></div>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-28 h-3 bg-gray-200 rounded mt-2"></div>
                </div>
                
                {/* Checkbox */}
                <div className={`bg-white rounded-lg p-3 shadow-sm transition-all duration-500 ${
                  animationStep === 3 ? 'transform translate-x-2 opacity-100' : 'opacity-60'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <div className="w-32 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Cursor/Hand */}
              <div className="absolute top-8 right-4 transform rotate-12">
                <svg className="w-6 h-6 text-indigo-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l-.259.966a1 1 0 001.932.518l.259-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.259zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Preview
              </div>
            </div>
          </div>
          
          {/* Floating success indicators */}
          <div className="absolute top-60 left-10 transform -rotate-12">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="absolute bottom-60 right-5 transform rotate-12">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M 100 200 Q 200 150 300 200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 