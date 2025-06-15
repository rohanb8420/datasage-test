import React from 'react';

// Sidebar navigation groups
const mainPages = ['Dashboard'];
const modules = [
  'Reports & Forecasts',
  'eRFQ',
  'Vendors',
  'Reverse Auctions',
  'AI Agents',
];
const reports = [
  'Spend Overview',
  'Forecast Summary',
  'RFQ Activity',
  'Vendor Performance',
  'Auction Results',
  'AI Agent Insights',
];

function Sidebar() {
  return (
    <aside className="flex flex-col bg-gray-800 text-white w-64 h-screen border-r border-gray-700">
      {/* Logo / Title */}
      <div className="flex items-center px-4 py-3">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
        >
          <circle fill="#4F46E5" cx="16" cy="16" r="16" />
          <text
            x="16"
            y="21"
            textAnchor="middle"
            fontSize="12"
            fill="#fff"
            fontFamily="Arial"
          >
            DS
          </text>
        </svg>
        <span className="ml-3 text-xl font-bold uppercase">DATASAGE</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        {/* Main section */}
        <div className="mt-4">
          <h3 className="px-2 text-gray-400 uppercase text-xs font-semibold">
            Main
          </h3>
          {mainPages.map((item) => (
            <a
              key={item}
              href="#"
              className="block px-4 py-2 mt-1 rounded hover:bg-gray-700"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Modules section */}
        <div className="mt-6">
          <h3 className="px-2 text-gray-400 uppercase text-xs font-semibold">
            Modules
          </h3>
          {modules.map((item) => (
            <a
              key={item}
              href="#"
              className="block px-4 py-2 mt-1 rounded hover:bg-gray-700"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Reports section */}
        <div className="mt-6">
          <h3 className="px-2 text-gray-400 uppercase text-xs font-semibold">
            Reports
          </h3>
          {reports.map((item) => (
            <a
              key={item}
              href="#"
              className="block px-4 py-2 mt-1 rounded hover:bg-gray-700"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;