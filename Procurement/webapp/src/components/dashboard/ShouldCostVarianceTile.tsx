import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface RawData {
  Category: string;
  'Should-Cost ($)': number;
  'Average Bid ($)': number;
}

interface ChartData {
  category: string;
  shouldCost: number;
  avgBid: number;
}

const ShouldCostVarianceTile: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  useEffect(() => {
    Papa.parse<RawData>('/data/should_cost.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = (results.data as RawData[]).filter(r => r.Category);
        const chartData = rows.map(r => ({
          category: r.Category,
          shouldCost: r['Should-Cost ($)'],
          avgBid: r['Average Bid ($)'],
        }));
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Should-Cost Variance</h3>
        </div>
      </div>
      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barCategoryGap="20%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="category" tick={{ fill: 'currentColor', fontSize: 12 }} height={40} />
            <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(val) => `$${(val as number / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(val) => `$${(val as number).toLocaleString()}`} />
            <Legend verticalAlign="top" wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
            <Bar dataKey="shouldCost" name="Should-Cost" fill="#3182ce" />
            <Bar dataKey="avgBid" name="Average Bid" fill="#48bb78" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ShouldCostVarianceTile;