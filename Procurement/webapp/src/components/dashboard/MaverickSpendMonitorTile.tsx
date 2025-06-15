import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface RawData {
  Month: string;
  'On-Contract Spend': number;
  'Off-Contract Spend': number;
}

const MaverickSpendMonitorTile: React.FC = () => {
  const [data, setData] = useState<RawData[]>([]);
  useEffect(() => {
    Papa.parse<RawData>('/data/maverick_spend.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = (results.data as RawData[]).filter(r => r.Month);
        setData(rows);
      }
    });
  }, []);

  const latest = data[data.length - 1] || { 'On-Contract Spend': 0, 'Off-Contract Spend': 0 };
  const donutData = [
    { name: 'On-Contract', value: latest['On-Contract Spend'] },
    { name: 'Off-Contract', value: latest['Off-Contract Spend'] }
  ];
  const COLORS = ['#48bb78', '#e53e3e'];

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center space-x-2">
          <ExclamationCircleIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Maverick Spend Monitor</h3>
        </div>
      </div>
      {/* Chart area */}
      <div className="flex-1 flex">
        {/* Donut chart */}
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="90%" height="90%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                outerRadius="80%"
                label
              >
                {donutData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `$${(val as number).toLocaleString()}`} />
<Legend verticalAlign="bottom" wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Trendline */}
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="90%" height="90%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
<CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
<XAxis dataKey="Month" tick={{ fill: 'currentColor', fontSize: 12 }} />
<YAxis tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={(val) => `$${(val as number / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(val) => `$${(val as number).toLocaleString()}`} />
<Legend verticalAlign="top" wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
              <Line type="monotone" dataKey="On-Contract Spend" name="On-Contract" stroke="#48bb78" dot={false} />
              <Line type="monotone" dataKey="Off-Contract Spend" name="Off-Contract" stroke="#e53e3e" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MaverickSpendMonitorTile;