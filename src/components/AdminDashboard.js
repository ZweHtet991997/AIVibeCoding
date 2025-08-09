import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SummaryCards from './dashboard/SummaryCards';
import StatisticsChart from './dashboard/StatisticsChart';
import ApprovalStatusChart from './dashboard/ApprovalStatusChart';
import RecentSubmissionsTable from './dashboard/RecentSubmissionsTable';
import FormsScreen from './dashboard/FormsScreen';
import ApprovalsScreen from './dashboard/ApprovalsScreen';
import SpamSubmissionsScreen from './dashboard/SpamSubmissionsScreen';
import UserListScreen from './dashboard/UserListScreen';
import { logout, getUserName, isAdmin } from '../utils/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Verify admin access and set initial menu
  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    // Set initial menu from navigation state
    if (location.state && location.state.activeMenu) {
      setActiveMenu(location.state.activeMenu);
    }

    // Set loading to false after verification
    setIsLoading(false);
  }, [location.state, navigate]);

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(() => [
    { 
      name: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      name: 'Forms', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      name: 'Submissions', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Spam Submissions', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    { 
      name: 'Users', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ], []);

  // Memoize handlers to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [navigate]);

  const handleMenuClick = useCallback((menuName) => {
    setActiveMenu(menuName);
  }, []);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Memoize the current user name
  const currentUserName = useMemo(() => getUserName(), []);

  // Show loading state while verifying admin access
  if (isLoading) {
    return (
      <div className="soft-bg min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse-slow"></div>
              <div className="absolute inset-2 bg-white rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Verifying Access</h3>
            <p className="text-gray-600">Please wait while we verify your admin privileges...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="soft-bg min-h-screen flex">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-gentle-float"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-cyan-200/30 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} h-screen fixed left-0 top-0 glass-soft transition-all duration-300 ease-in-out flex flex-col z-20`}>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <img 
              src="/assets/images/BIM.png" 
              alt="BIM Logo" 
              className={`${sidebarOpen ? 'w-24' : 'w-10'} h-auto transition-all duration-300`}
            />
            {sidebarOpen && (
              <button
                onClick={handleSidebarToggle}
                className="glass-button rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
          {!sidebarOpen && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSidebarToggle}
                className="glass-button rounded-lg p-2 text-gray-600 hover:text-gray-800 hover:neon-soft transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <div key={item.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <button
                onClick={() => handleMenuClick(item.name)}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-300 group ${
                  activeMenu === item.name
                    ? 'glass-card text-gray-800 neon-soft'
                    : 'hover:neon-soft text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className={`${sidebarOpen ? 'mr-4' : 'mx-auto'} transition-all duration-300`}>
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group glass-button text-gray-600 hover:text-gray-800 hover:neon-soft"
          >
            <span className={`${sidebarOpen ? 'mr-4' : 'mx-auto'} transition-all duration-300`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            {sidebarOpen && (
              <span className="font-medium">Log out</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto relative z-10 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 animate-slide-down">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {activeMenu}
                </h1>
                <p className="text-gray-600 text-lg">
                  Welcome back, <span className="text-gray-800 font-semibold">{currentUserName}</span>! 
                  Here's what's happening with your forms and submissions.
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-8">
            {activeMenu === 'Dashboard' && (
              <div className="animate-fade-in">
                {/* Summary Cards */}
                <div className="mb-8">
                  <SummaryCards />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <StatisticsChart />
                  </div>
                  <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
                    <ApprovalStatusChart />
                  </div>
                </div>

                {/* Recent Submissions Table */}
                <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
                  <RecentSubmissionsTable />
                </div>
              </div>
            )}

            {/* Forms Screen Content */}
            {activeMenu === 'Forms' && (
              <div className="animate-fade-in">
                <FormsScreen />
              </div>
            )}

            {/* Submissions Screen Content */}
            {activeMenu === 'Submissions' && (
              <div className="animate-fade-in">
                <ApprovalsScreen />
              </div>
            )}

            {/* Spam Submissions Screen Content */}
            {activeMenu === 'Spam Submissions' && (
              <div className="animate-fade-in">
                <SpamSubmissionsScreen />
              </div>
            )}

            {/* Users Screen Content */}
            {activeMenu === 'Users' && (
              <div className="animate-fade-in">
                <UserListScreen />
              </div>
            )}

            {/* Other Menu Content */}
            {activeMenu !== 'Dashboard' && activeMenu !== 'Forms' && activeMenu !== 'Submissions' && activeMenu !== 'Spam Submissions' && activeMenu !== 'Users' && (
              <div className="glass-card rounded-2xl p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {activeMenu} Management
                </h2>
                <p className="text-gray-600 text-lg">
                  This section will contain {activeMenu.toLowerCase()} management features.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdminDashboard); 