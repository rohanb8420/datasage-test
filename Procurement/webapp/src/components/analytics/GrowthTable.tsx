import React from "react";

const GrowthTable: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h3 className="text-lg font-semibold mb-2">MoM & YoY Growth</h3>
    <div className="overflow-auto">
      <table className="min-w-full text-gray-700 dark:text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Period</th>
            <th className="px-4 py-2">MoM %</th>
            <th className="px-4 py-2">YoY %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Last Month</td>
            <td className="border px-4 py-2">+2.5%</td>
            <td className="border px-4 py-2">+15.0%</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">This Month</td>
            <td className="border px-4 py-2">+3.2%</td>
            <td className="border px-4 py-2">+18.4%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default GrowthTable;