import React from 'react';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-900 p-6 overflow-auto">
        {/* Dashboard Header */}
        <h1 className="text-2xl text-white font-bold mb-6">Dashboard</h1>
        {/* Dashboard Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded shadow p-4 text-white">Spend Overview</div>
          <div className="bg-gray-800 rounded shadow p-4 text-white">Forecast Summary</div>
          <div className="bg-gray-800 rounded shadow p-4 text-white">RFQ Activity</div>
          <div className="bg-gray-800 rounded shadow p-4 text-white">Vendor Performance</div>
          <div className="bg-gray-800 rounded shadow p-4 text-white">Auction Results</div>
          <div className="bg-gray-800 rounded shadow p-4 text-white">AI Agent Insights</div>
        </div>
      </main>
    </div>
  );
}

export default App;