import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { topSuppliers as topSuppliersData } from '../../config/topSuppliers';
import type { SupplierInfo as Supplier } from '../../config/topSuppliers';

// Using central topSuppliersData imported from config/topSuppliers

// Helper to format spend in millions (e.g. $2.5M)
const formatSpend = (value: number): string => {
  const millions = value / 1_000_000;
  return `$${millions.toFixed(1)}M`;
};

const TopSuppliersLeaderboardTile: React.FC = () => (
  <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
    {/* Tile header */}
    <div className="flex items-center space-x-2 h-8">
      <ShoppingCartIcon className="h-6 w-6" />
      <h3 className="text-lg font-semibold">Top Suppliers</h3>
    </div>
    {/* Leaderboard rows */}
    <div className="flex-1 overflow-auto space-y-2">
      {topSuppliersData.map((supplier) => (
        <div key={supplier.rank} className="flex items-center">
          {/* Rank */}
          <span className="w-8 text-gray-400">{String(supplier.rank).padStart(2, '0')}</span>
          {/* Name */}
          <span className="flex-1 font-medium">{supplier.name}</span>
          {/* Spend */}
          <span className="w-28 text-gray-400">{formatSpend(supplier.spend)}</span>
          {/* Growth */}
          <span
            className={
              `w-16 text-right font-medium ${
                supplier.growth >= 0 ? 'text-green-400' : 'text-red-400'
              }`
            }
          >
            {supplier.growth >= 0
              ? `+${supplier.growth}%`
              : `${supplier.growth}%`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default TopSuppliersLeaderboardTile;