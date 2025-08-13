import React, { useState, useEffect, useRef } from 'react';
import { dashboardAPI } from '../../utils/api';

const StatisticsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dimensions, setDimensions] = useState({ width: 700, height: 250 }); // Set initial dimensions
  const containerRef = useRef(null);

  // Load dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const dashboardData = await dashboardAPI.getDashboardData();
        setData(dashboardData.barChartData || []);
      } catch (err) {
        setError(err.message || 'Failed to load statistics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const width = Math.max(300, rect.width - 48); // Account for padding
        const height = Math.max(200, Math.min(300, width * 0.4)); // Responsive height
        setDimensions({ width, height });
      }
    };

    // Initial update
    updateDimensions();

    // Use ResizeObserver for better performance
    let resizeObserver;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(containerRef.current);
    } else {
      // Fallback to window resize listener
      window.addEventListener('resize', updateDimensions);
    }

    // Also update after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateDimensions, 100);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateDimensions);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  // Chart configuration
  const chartConfig = {
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
    barWidth: Math.max(15, Math.min(25, (dimensions.width - 120) / (data.length * 2 + (data.length - 1) * 0.5) / 2)),
    barGap: 8,
    groupGap: Math.max(20, Math.min(40, (dimensions.width - 120) / data.length * 0.1)),
  };

  const chartWidth = dimensions.width - chartConfig.margin.left - chartConfig.margin.right;
  const chartHeight = dimensions.height - chartConfig.margin.top - chartConfig.margin.bottom;

  // Calculate scales
  const maxValue = Math.max(...data.map(d => Math.max(d.submitted, d.notSubmitted)));
  const yScale = maxValue > 0 ? chartHeight / (maxValue * 1.2) : chartHeight / 10;
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
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
              Form Submission Status by Assigned Users
            </h3>
            <p className="text-gray-600 text-sm">
              Track submission rates across different forms
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0 ml-4">
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
        <div className="space-y-2" ref={containerRef}>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #654ea3, #eaafc8)' }}></div>
              <span className="text-sm font-medium text-gray-700">Submitted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #5D4157, #A8CABA)' }}></div>
              <span className="text-sm font-medium text-gray-700">Not Submitted</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex justify-center overflow-x-auto">
            <svg
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="overflow-visible"
              style={{ minWidth: '300px' }}
            >
              {/* Definitions for gradients */}
              <defs>
                <linearGradient id="submittedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#654ea3" />
                  <stop offset="100%" stopColor="#eaafc8" />
                </linearGradient>
                <linearGradient id="notSubmittedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5D4157" />
                  <stop offset="100%" stopColor="#A8CABA" />
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
                {Array.from({ length: Math.max(1, Math.ceil(maxValue / 5) + 1) }, (_, i) => {
                  const value = i * 5;
                  const y = Math.max(0, chartHeight - (value * yScale));
                  if (y >= 0 && y <= chartHeight) {
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
                  }
                  return null;
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
                  const submittedHeight = Math.min(item.submitted * yScale, chartHeight);
                  const notSubmittedHeight = Math.min(item.notSubmitted * yScale, chartHeight);
                  
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
                        y={Math.max(chartHeight - submittedHeight - 8, 12)}
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
                        y={Math.max(chartHeight - notSubmittedHeight - 8, 12)}
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