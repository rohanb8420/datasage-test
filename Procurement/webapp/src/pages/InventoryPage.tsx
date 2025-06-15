import React from "react";

const InventoryPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Inventory & Procurement</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 h-40 rounded shadow" />
      <div className="bg-white dark:bg-gray-800 h-40 rounded shadow" />
      <div className="bg-white dark:bg-gray-800 h-40 rounded shadow" />
      <div className="bg-white dark:bg-gray-800 h-40 rounded shadow" />
    </div>
  </div>
);

export default InventoryPage;