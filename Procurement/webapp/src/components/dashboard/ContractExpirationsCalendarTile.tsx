import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

interface RawData {
  'Contract Name': string;
  'Expiration Date': string;
  'Value ($)': number;
}

interface ChartData {
  name: string;
  expiration: string;
  value: number;
}

const ContractExpirationsCalendarTile: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  useEffect(() => {
    Papa.parse<RawData>('/data/contract_expirations.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = (results.data as RawData[]).filter(r => r['Contract Name']);
        const chartData = rows.map(r => ({
          name: r['Contract Name'],
          expiration: r['Expiration Date'],
          value: r['Value ($)'],
        })).sort((a, b) => new Date(a.expiration).getTime() - new Date(b.expiration).getTime());
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center space-x-2">
          <CalendarDaysIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Contract Expirations</h3>
        </div>
      </div>
      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 10, right: 10, left: 50, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis
              type="number"
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickFormatter={(val) => `$${(val as number / 1_000_000).toFixed(1)}M`}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={120}
              tick={{ fill: 'currentColor', fontSize: 12 }}
            />
            <Tooltip
              formatter={(val) => `$${(val as number).toLocaleString()}`}
              labelFormatter={(label) => `Contract: ${label}`}
            />
            <Bar dataKey="value" name="Value" fill="#4c51bf" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContractExpirationsCalendarTile;