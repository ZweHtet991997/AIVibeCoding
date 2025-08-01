import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../utils/api';

const StatisticsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const dashboardData = await dashboardAPI.getDashboardData();
        setData(dashboardData.barChartData || []);
      } catch (err) {
        console.error('Error fetching statistics data:', err);
        setError(err.message || 'Failed to load statistics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart configuration
  const chartConfig = {
    width: 600,
    height: 200,
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    barWidth: 25,
    barGap: 8,
    groupGap: 40,
  };

  const chartWidth = chartConfig.width - chartConfig.margin.left - chartConfig.margin.right;
  const chartHeight = chartConfig.height - chartConfig.margin.top - chartConfig.margin.bottom;

  // Calculate scales
  const maxValue = Math.max(...data.map(d => Math.max(d.submitted, d.notSubmitted)));
  const yScale = chartHeight / (maxValue * 1.2); // Add 20% padding
  const xScale = chartWidth / (data.length * 2 + (data.length - 1) * 0.5);

  // Colors
  const colors = {
    submitted: 'url(#submittedGradient)',
    notSubmitted: 'url(#notSubmittedGradient)',
  };

  return (
    <div className="bg-white/60 glass-card rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Form Submission Status by Assigned Users
            </h3>
            <p className="text-gray-600 text-sm">
              Track submission rates across different forms
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-blue-400/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          </div>
          <span className="ml-4 text-gray-700 font-medium">Loading statistics...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="glass-button rounded-xl p-4">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No statistics available</p>
          <p className="text-gray-400 text-sm mt-1">Data will appear here once available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #feb47b, #ff7e5f)' }}></div>
              <span className="text-sm font-medium text-gray-700">Submitted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #606c88, #3f4c6b)' }}></div>
              <span className="text-sm font-medium text-gray-700">Not Submitted</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex justify-center">
            <svg
              width={chartConfig.width}
              height={chartConfig.height}
              className="overflow-visible"
            >
              {/* Definitions for gradients */}
              <defs>
                <linearGradient id="submittedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#feb47b" />
                  <stop offset="100%" stopColor="#ff7e5f" />
                </linearGradient>
                <linearGradient id="notSubmittedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#606c88" />
                  <stop offset="100%" stopColor="#3f4c6b" />
                </linearGradient>
              </defs>

              {/* Chart area */}
              <g transform={`translate(${chartConfig.margin.left}, ${chartConfig.margin.top})`}>
                
                {/* Y-axis */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={chartHeight}
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                
                {/* Y-axis ticks and labels */}
                {Array.from({ length: Math.ceil(maxValue / 5) + 1 }, (_, i) => {
                  const value = i * 5;
                  const y = chartHeight - (value * yScale);
                  return (
                    <g key={i}>
                      <line
                        x1="-5"
                        y1={y}
                        x2="0"
                        y2={y}
                        stroke="#E5E7EB"
                        strokeWidth="1"
                      />
                      <text
                        x="-10"
                        y={y + 4}
                        textAnchor="end"
                        className="text-xs fill-gray-600"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}

                {/* Y-axis label */}
                <text
                  x="-30"
                  y={chartHeight / 2}
                  textAnchor="middle"
                  transform={`rotate(-90, -30, ${chartHeight / 2})`}
                  className="text-sm font-medium fill-gray-700"
                >
                  Number of Users
                </text>

                {/* X-axis */}
                <line
                  x1="0"
                  y1={chartHeight}
                  x2={chartWidth}
                  y2={chartHeight}
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />

                {/* Bars */}
                {data.map((item, index) => {
                  const groupX = index * (chartConfig.barWidth * 2 + chartConfig.groupGap);
                  const submittedHeight = item.submitted * yScale;
                  const notSubmittedHeight = item.notSubmitted * yScale;
                  
                  return (
                    <g key={index}>
                      {/* Submitted bar */}
                      <rect
                        x={groupX}
                        y={chartHeight - submittedHeight}
                        width={chartConfig.barWidth}
                        height={submittedHeight}
                        fill={colors.submitted}
                        rx="4"
                        ry="4"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                      
                      {/* Submitted value label */}
                      <text
                        x={groupX + chartConfig.barWidth / 2}
                        y={chartHeight - submittedHeight - 8}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-gray-800"
                      >
                        {item.submitted}
                      </text>

                      {/* Not Submitted bar */}
                      <rect
                        x={groupX + chartConfig.barWidth + chartConfig.barGap}
                        y={chartHeight - notSubmittedHeight}
                        width={chartConfig.barWidth}
                        height={notSubmittedHeight}
                        fill={colors.notSubmitted}
                        rx="4"
                        ry="4"
                        className="transition-all duration-300 hover:opacity-80"
                      />
                      
                      {/* Not Submitted value label */}
                      <text
                        x={groupX + chartConfig.barWidth + chartConfig.barGap + chartConfig.barWidth / 2}
                        y={chartHeight - notSubmittedHeight - 8}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-gray-800"
                      >
                        {item.notSubmitted}
                      </text>

                      {/* X-axis label */}
                      <text
                        x={groupX + chartConfig.barWidth + chartConfig.barGap / 2}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        transform={`rotate(-15, ${groupX + chartConfig.barWidth + chartConfig.barGap / 2}, ${chartHeight + 20})`}
                        className="text-xs font-medium fill-gray-700"
                      >
                        {item.formName}
                      </text>
                    </g>
                  );
                })}

                {/* X-axis label */}
                <text
                  x={chartWidth / 2}
                  y={chartHeight + 50}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700"
                >
                  Forms
                </text>
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsChart; 