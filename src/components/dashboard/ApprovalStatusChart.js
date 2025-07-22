import React from 'react';

const ApprovalStatusChart = () => {
  const data = [
    { status: 'Approved', count: 2847, percentage: 68, color: 'bg-dashboard-approved' },
    { status: 'Pending', count: 156, percentage: 4, color: 'bg-dashboard-pending' },
    { status: 'Rejected', count: 889, percentage: 28, color: 'bg-dashboard-rejected' }
  ];

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-dashboard-cardBg rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dashboard-bodyText mb-2">
          Approval Status Breakdown
        </h3>
        <p className="text-sm text-gray-600">
          Distribution of form submission statuses
        </p>
      </div>

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
              stroke="#f3f4f6"
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
                
                return (
                  <path
                    key={index}
                    d={pathData}
                    fill="none"
                    stroke={item.color === 'bg-dashboard-approved' ? '#4ECB71' : 
                           item.color === 'bg-dashboard-pending' ? '#FFC107' : 
                           item.color === 'bg-dashboard-rejected' ? '#FF4D4F' : '#ccc'}
                    strokeWidth="8"
                  />
                );
              });
            })()}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-dashboard-bodyText">
                {total.toLocaleString()}
              </div>
              <div className="text-xs text-dashboard-headerText">
                Total
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                <span className="text-sm text-dashboard-bodyText">
                  {item.status}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-dashboard-bodyText">
                  {item.count.toLocaleString()}
                </div>
                <div className="text-xs text-dashboard-headerText">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApprovalStatusChart; 