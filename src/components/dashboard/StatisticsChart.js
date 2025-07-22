import React from 'react';

const StatisticsChart = () => {
  const data = [
    { month: 'Jan', formsCreated: 45, submissions: 120 },
    { month: 'Feb', formsCreated: 52, submissions: 135 },
    { month: 'Mar', formsCreated: 48, submissions: 110 },
    { month: 'Apr', formsCreated: 61, submissions: 145 },
    { month: 'May', formsCreated: 55, submissions: 130 },
    { month: 'Jun', formsCreated: 67, submissions: 160 },
    { month: 'Jul', formsCreated: 58, submissions: 140 },
    { month: 'Aug', formsCreated: 72, submissions: 175 },
    { month: 'Sep', formsCreated: 65, submissions: 155 },
    { month: 'Oct', formsCreated: 78, submissions: 185 },
    { month: 'Nov', formsCreated: 70, submissions: 165 },
    { month: 'Dec', formsCreated: 85, submissions: 200 }
  ];

  const maxValue = Math.max(...data.map(d => Math.max(d.formsCreated, d.submissions)));

  return (
    <div className="bg-dashboard-cardBg rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dashboard-bodyText mb-2">
          Submissions Over Time
        </h3>
        <p className="text-sm text-gray-600">
          Monthly comparison of forms created vs submissions received
        </p>
      </div>

      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-dashboard-formsCreated rounded mr-2"></div>
            <span className="text-dashboard-bodyText">Forms Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-dashboard-submissions rounded mr-2"></div>
            <span className="text-dashboard-bodyText">Submissions</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-64">
          <div className="flex items-end justify-between h-full space-x-1">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                {/* Submissions Bar */}
                <div className="w-full flex justify-center">
                  <div
                    className="w-3/4 bg-dashboard-submissions rounded-t"
                    style={{
                      height: `${(item.submissions / maxValue) * 200}px`
                    }}
                  ></div>
                </div>
                
                {/* Forms Created Bar */}
                <div className="w-full flex justify-center">
                  <div
                    className="w-3/4 bg-dashboard-formsCreated rounded-t"
                    style={{
                      height: `${(item.formsCreated / maxValue) * 200}px`
                    }}
                  ></div>
                </div>
                
                {/* Month Label */}
                <span className="text-xs text-dashboard-headerText mt-2">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-dashboard-headerText px-2">
          <span>0</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{maxValue}</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart; 