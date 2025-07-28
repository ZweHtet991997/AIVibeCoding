import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../utils/api';
import { isAdmin } from '../../utils/auth';

const SummaryCards = () => {
  const [stats, setStats] = useState({
    totalFormsCreated: 0,
    totalSubmissionsReceived: 0,
    totalPendingApprovals: 0,
    totalApproved: 0,
    totalRejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Only fetch data if user is admin
      if (!isAdmin()) {
        setError('Admin privileges required to view dashboard data.');
        setLoading(false);
        return;
      }

      const data = await dashboardAPI.getDashboardData();
      setStats({
        totalFormsCreated: data.totalFormsCreated || 0,
        totalSubmissionsReceived: data.totalSubmissionsReceived || 0,
        totalPendingApprovals: data.totalPendingApprovals || 0,
        totalApproved: data.totalApproved || 0,
        totalRejected: data.totalRejected || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refresh data when component mounts or user refreshes page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const cards = [
    {
      title: 'Total Forms Created',
      value: loading ? '...' : stats.totalFormsCreated.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: 'from-blue-400 to-cyan-400',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Total Submissions Received',
      value: loading ? '...' : stats.totalSubmissionsReceived.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-purple-400 to-pink-400',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      title: 'Total Pending Approvals',
      value: loading ? '...' : stats.totalPendingApprovals.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-yellow-400 to-orange-400',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      title: 'Total Approved / Rejected',
      value: loading ? '...' : `${stats.totalApproved.toLocaleString()} / ${stats.totalRejected.toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-green-400 to-emerald-400',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    }
  ];

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-4 glass-card rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Error Loading Dashboard Data</h3>
              <p className="text-gray-600 mb-3">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="glass-button px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:neon-soft transition-all duration-300"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="glass-card rounded-2xl p-6 animate-scale-in group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 bg-gradient-to-r ${card.bgGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <div className={`text-gray-700 ${card.gradient} bg-gradient-to-r bg-clip-text`}>
                {card.icon}
              </div>
            </div>
            <div className="text-right">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              {card.title}
            </h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-800">
                {card.value}
              </p>
            </div>
          </div>
          
          {/* Subtle border gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-gray-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards; 