import React, { useState, useEffect } from 'react';

const StatisticsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load empty data
  useEffect(() => {
    setData([]);
  }, []);

  const maxValue = Math.max(...data.map(d => Math.max(d.formsCreated, d.submissions)));

  return (
    <div className="bg-white/60 glass-card rounded-2xl p-6 h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Submissions Over Time
            </h3>
            <p className="text-gray-600 text-sm">
              Monthly comparison of forms created vs submissions received
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

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
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded mr-3"></div>
              <span className="text-gray-600 font-medium">Forms Created</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded mr-3"></div>
              <span className="text-gray-600 font-medium">Submissions</span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64">
            <div className="flex items-end justify-between h-full space-x-2">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2 group">
                  {/* Submissions Bar */}
                  <div className="w-full flex justify-center">
                    <div
                      className="w-3/4 bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg transition-all duration-300 group-hover:shadow-md group-hover:shadow-purple-500/20"
                      style={{
                        height: `${(item.submissions / maxValue) * 200}px`
                      }}
                    ></div>
                  </div>
                  
                  {/* Forms Created Bar */}
                  <div className="w-full flex justify-center">
                    <div
                      className="w-3/4 bg-gradient-to-t from-blue-400 to-cyan-400 rounded-t-lg transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue-500/20"
                      style={{
                        height: `${(item.formsCreated / maxValue) * 200}px`
                      }}
                    ></div>
                  </div>
                  
                  {/* Month Label */}
                  <span className="text-xs text-gray-500 font-medium mt-2 group-hover:text-gray-700 transition-colors duration-300">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {[0, 25, 50, 75, 100].map((percent, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-gray-200/30"
                  style={{ top: `${percent}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Y-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 px-2">
            <span>0</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{maxValue}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsChart; 