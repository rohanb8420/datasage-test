import React from "react";
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import SpendTrendChart from "./SpendTrendChart";

const SpendTrendTile: React.FC = () => (
  <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
    {/* Header */}
    <div className="flex items-center space-x-2 h-8">
      <ArrowTrendingUpIcon className="h-6 w-6" />
      <h3 className="text-lg font-semibold">Spend Trend</h3>
    </div>
    {/* Chart area */}
    <div className="flex-1">
      <SpendTrendChart />
    </div>
  </div>
);
export default SpendTrendTile;