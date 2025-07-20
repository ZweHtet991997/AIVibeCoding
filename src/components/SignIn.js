import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Animation sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store user data in localStorage or sessionStorage
        localStorage.setItem('user', JSON.stringify(data));
        
        // Navigate based on user role
        if (data.role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (data.role === 'Normal User') {
          navigate('/user-home');
        } else {
          setError('Invalid user role');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 sm:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 mr-3">
              <img 
                src="/assets/images/BIM.png" 
                alt="BIM Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-serif text-gray-800">GROUP OF COMPANIES</span>
          </div>
          
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Hello, Welcome Back
            </h1>
            <p className="text-gray-600">
              Create, manage, submit, and track forms with streamlined workflow
            </p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
              )}
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Right Panel - Animated Form Builder */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
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
          <div className="absolute top-20 -left-4 transform -rotate-12">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="absolute bottom-20 -right-4 transform rotate-12">
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