import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../utils/api';
import { isAdmin } from '../../utils/auth';

const ApprovalStatusChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Only fetch data if user is admin
      if (!isAdmin()) {
        setError('Admin privileges required to view approval data.');
        setLoading(false);
        return;
      }

      const dashboardData = await dashboardAPI.getDashboardData();
      const approvalBreakdown = dashboardData.approvalStatusBreakdown;
      
      if (approvalBreakdown) {
        const chartData = [
          {
            status: 'Approved',
            count: approvalBreakdown.approved?.count || 0,
            percentage: approvalBreakdown.approved?.percentage || 0,
            gradient: 'from-green-400 to-emerald-400',
            bgGradient: 'from-green-500/10 to-emerald-500/10'
          },
          {
            status: 'Pending',
            count: approvalBreakdown.pending?.count || 0,
            percentage: approvalBreakdown.pending?.percentage || 0,
            gradient: 'from-yellow-400 to-orange-400',
            bgGradient: 'from-yellow-500/10 to-orange-500/10'
          },
          {
            status: 'Rejected',
            count: approvalBreakdown.rejected?.count || 0,
            percentage: approvalBreakdown.rejected?.percentage || 0,
            gradient: 'from-red-400 to-pink-400',
            bgGradient: 'from-red-500/10 to-pink-500/10'
          }
        ].filter(item => item.count > 0); // Only show non-zero values
        
        setData(chartData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching approval data:', error);
      setError(error.message || 'Failed to load approval data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalData();
  }, []);

  // Refresh data when component mounts or user refreshes page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchApprovalData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white/60 glass-card rounded-2xl p-6 h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Approval Status Breakdown
            </h3>
            <p className="text-gray-600 text-sm">
              Distribution of form submission statuses
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-green-400/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-green-400 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          </div>
          <span className="ml-4 text-gray-700 font-medium">Loading approval statistics...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="glass-button rounded-xl p-4">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-red-500 mb-2">{error}</div>
            <button 
              onClick={fetchApprovalData}
              className="glass-button px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:neon-soft transition-all duration-300"
            >
              Try again
            </button>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No approval statistics available</p>
          <p className="text-gray-400 text-sm mt-1">Data will appear here once available</p>
        </div>
      ) : (
        <div className="flex items-center space-x-8">
          {/* Donut Chart */}
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(229, 231, 235, 0.5)"
                strokeWidth="8"
              />
              
              {/* Data segments */}
              {(() => {
                let currentAngle = 0;
                return data.map((item, index) => {
                  const angle = (item.percentage / 100) * 360;
                  const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                  
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  const pathData = [
                    `M ${x1} ${y1}`,
                    `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`
                  ].join(' ');
                  
                  currentAngle += angle;
                  
                  // Define gradient colors based on status
                  const strokeColor = item.status === 'Approved' ? '#10B981' : 
                                   item.status === 'Pending' ? '#F59E0B' : 
                                   item.status === 'Rejected' ? '#EF4444' : '#6B7280';
                  
                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="8"
                      className="transition-all duration-300 hover:stroke-width-10"
                    />
                  );
                });
              })()}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {total.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Total
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-4">
            {data.map((item, index) => (
              <div key={index} className="glass-card rounded-xl p-3 group hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 bg-gradient-to-r ${item.gradient} rounded-full mr-3`}></div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">
                      {item.count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalStatusChart; 