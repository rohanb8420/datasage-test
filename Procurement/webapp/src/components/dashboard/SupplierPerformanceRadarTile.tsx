import React, { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartBarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { supplierScorecards } from '../../config/supplierPerformance';

interface SupplierScorecard {
  supplier: string;
  OTIF: number;
  PPM: number;
  Quality: number;
  ESG: number;
  Innovation: number;
}

const SupplierPerformanceRadarTile: React.FC = () => {
  // Use static config for performance data
  const rawData = supplierScorecards;
  const suppliers = rawData.map(d => d.supplier);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(suppliers);

  // Toggle supplier in selection
  const handleSupplierToggle = (supp: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(supp) ? prev.filter(s => s !== supp) : [...prev, supp]
    );
  };

  // Prepare chart data
  const metrics = rawData.length > 0
    ? (Object.keys(rawData[0]) as Array<keyof SupplierScorecard>).filter(k => k !== 'supplier')
    : [];
  const chartData = metrics.map(metric => {
    const entry: any = { metric };
    selectedSuppliers.forEach((supp) => {
      const rec = rawData.find(d => d.supplier === supp);
      entry[supp] = rec ? (rec[metric] as number) : 0;
    });
    return entry;
  });
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col relative text-slate-800 dark:text-white">
      {/* Header with title and dropdown */}
      <div className="flex-none flex items-center justify-between h-8">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Supplier Performance</h3>
        </div>
        <details className="relative">
          <summary className="flex items-center text-gray-600 dark:text-gray-200 cursor-pointer">
            <span className="text-sm mr-1">Select</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-600 dark:text-gray-200" />
          </summary>
          <ul className="absolute right-0 mt-1 w-40 max-h-56 overflow-auto bg-slate-800 p-2 rounded shadow-lg text-sm space-y-2 z-10">
            {suppliers.map(supp => (
              <li key={supp} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedSuppliers.includes(supp)}
                  onChange={() => handleSupplierToggle(supp)}
                />
                <span>{supp}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center">
        {selectedSuppliers.length === 0 ? (
          <p className="text-gray-400">Select at least one supplier to view performance radar chart</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="60%">
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: 'currentColor', fontSize: 12 }} />
            {selectedSuppliers.map((supp, idx) => (
              <Radar
                key={supp}
                name={supp}
                dataKey={supp}
                stroke={COLORS[idx % COLORS.length]}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
            <Tooltip />
          </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SupplierPerformanceRadarTile;