import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface RawData {
  Month: string;
  Negotiated: number;
  Realised: number;
  Cumulative_Leakage_Percent: number;
}

const SavingsRealisedVsNegotiatedTile: React.FC = () => {
  const [data, setData] = useState<RawData[]>([]);
  useEffect(() => {
    Papa.parse<RawData>('/data/savings_realised.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: ({ data: rows }) => {
        setData((rows as RawData[]).filter(r => r.Month));
      },
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      {/* Header */}
      <div className="flex items-center space-x-2 h-8">
        <CurrencyDollarIcon className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Savings Realised vs Negotiated</h3>
      </div>
      {/* Chart area (90% height) */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="90%" height="90%">
          <ComposedChart
            data={data}
            margin={{ top: 0, right: 20, left: 20, bottom: 20 }}
            barCategoryGap="20%"
            barGap={4}
          >
            <CartesianGrid stroke="currentColor" strokeDasharray="2 2" strokeOpacity={0.1} />
            <XAxis
              dataKey="Month"
              tick={{ fill: 'currentColor', fontSize: 12 }}
              label={{ value: 'Month', position: 'insideBottom', offset: -15, fill: 'currentColor', fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: 'currentColor', fontSize: 12 }}
              label={{ value: 'Savings ($)', angle: -90, position: 'insideLeft', offset: -10, fill: 'currentColor', fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'currentColor', fontSize: 12 }}
              tickFormatter={(val) => `${val}%`}
              label={{ value: 'Leakage %', angle: 90, position: 'insideRight', offset: -10, fill: 'currentColor', fontSize: 12 }}
            />
            <Tooltip />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
            <Bar yAxisId="left" dataKey="Negotiated" name="Negotiated" fill="#42a5f5" />
            <Bar yAxisId="left" dataKey="Realised" name="Realised" fill="#66bb6a" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Cumulative_Leakage_Percent"
              name="Leakage %"
              stroke="#ffb74d"
              dot={false}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SavingsRealisedVsNegotiatedTile;