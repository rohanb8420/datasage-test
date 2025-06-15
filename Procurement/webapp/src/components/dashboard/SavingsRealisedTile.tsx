import React from "react";

const SavingsRealisedTile: React.FC = () => (
  <div className="bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-none rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 p-5 min-h-[22rem] flex flex-col justify-between text-slate-800 dark:text-white">
    <h3 className="text-lg font-semibold mb-2">Savings Realised vs Negotiated</h3>
    <div className="h-56 flex items-center justify-center text-gray-400 italic text-sm">
      Gauge Placeholder
    </div>
  </div>
);
export default SavingsRealisedTile;