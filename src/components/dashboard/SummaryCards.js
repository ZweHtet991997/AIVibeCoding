import React from 'react';

const SummaryCards = () => {
  const cards = [
    {
      title: 'Total Forms Created',
      value: '1,247',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Total Submissions Received',
      value: '3,892',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Pending Approvals',
      value: '156',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Approved / Rejected',
      value: '2,847 / 889',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-dashboard-cardBg rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="text-dashboard-bodyText mr-3">
                  {card.icon}
                </div>
                <h3 className="text-sm font-medium text-dashboard-headerText">
                  {card.title}
                </h3>
              </div>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-dashboard-bodyText">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards; 