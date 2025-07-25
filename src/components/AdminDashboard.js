import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SummaryCards from './dashboard/SummaryCards';
import StatisticsChart from './dashboard/StatisticsChart';
import ApprovalStatusChart from './dashboard/ApprovalStatusChart';
import RecentSubmissionsTable from './dashboard/RecentSubmissionsTable';
import FormsScreen from './dashboard/FormsScreen';
import ApprovalsScreen from './dashboard/ApprovalsScreen';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  // Set initial menu from navigation state
  useEffect(() => {
    if (location.state && location.state.activeMenu) {
      setActiveMenu(location.state.activeMenu);
    }
  }, [location.state]);

  const menuItems = [
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
      name: 'Approvals', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-dashboard-mainBg">
      {/* Sidebar */}
      <div className="w-64 bg-dashboard-sidebar text-dashboard-sidebarText flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700">
          <img 
            src="/assets/images/BIM.png" 
            alt="BIM Logo" 
            className="w-100 h-10 mx-auto"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === item.name
                      ? 'bg-dashboard-sidebarActiveBg text-dashboard-sidebarActive font-medium'
                      : 'text-dashboard-sidebarText hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-dashboard-sidebarText hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dashboard-bodyText">
              {activeMenu}
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your forms and submissions.
            </p>
          </div>

          {/* Dashboard Content */}
          {activeMenu === 'Dashboard' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <SummaryCards />

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatisticsChart />
                <ApprovalStatusChart />
              </div>

              {/* Recent Submissions Table */}
              <RecentSubmissionsTable />
            </div>
          )}

          {/* Forms Screen Content */}
          {activeMenu === 'Forms' && (
            <FormsScreen />
          )}

          {/* Approvals Screen Content */}
          {activeMenu === 'Approvals' && (
            <ApprovalsScreen />
          )}

          {/* Other Menu Content */}
          {activeMenu !== 'Dashboard' && activeMenu !== 'Forms' && activeMenu !== 'Approvals' && (
            <div className="bg-dashboard-cardBg rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-dashboard-bodyText mb-4">
                {activeMenu} Management
              </h2>
              <p className="text-gray-600">
                This section will contain {activeMenu.toLowerCase()} management features.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 