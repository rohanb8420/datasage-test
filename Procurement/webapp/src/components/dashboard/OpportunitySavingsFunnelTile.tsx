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
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';

interface RawData {
  Stage: string;
  'Opportunity Count': number;
  'Savings ($)': number;
}

interface ChartData {
  stage: string;
  count: number;
  savings: number;
}

const OpportunitySavingsFunnelTile: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  useEffect(() => {
    Papa.parse<RawData>('/data/savings_funnel.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = (results.data as RawData[]).filter(r => r.Stage);
        const chartData = rows.map(r => ({
          stage: r.Stage,
          count: r['Opportunity Count'],
          savings: r['Savings ($)'],
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
          <InboxArrowDownIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Opportunity / Savings Funnel</h3>
        </div>
      </div>
      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }} barCategoryGap="20%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="stage" tick={{ fill: 'currentColor', fontSize: 12 }} height={40} />
            <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(val) => typeof val === 'number' ? `${val}` : val} />
            <Tooltip formatter={(val, name) => name === 'savings' ? `$${(val as number / 1_000_000).toFixed(1)}M` : `${val}`} />
            <Legend verticalAlign="top" wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
            <Bar dataKey="count" name="Opportunity Count" fill="#667eea" />
            <Bar dataKey="savings" name="Savings" fill="#48bb78" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OpportunitySavingsFunnelTile;