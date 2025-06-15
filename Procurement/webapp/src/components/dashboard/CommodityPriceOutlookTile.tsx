import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartBarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

type RawData = {
  Month: string;
  'Steel Price ($)': number;
  'Fuel Index': number;
  'Aluminum Index': number;
  'Copper Price ($)': number;
  'Nickel Price ($)': number;
  'Gold Price ($)': number;
  'Silver Price ($)': number;
  'Lithium Price ($)': number;
};

const OPTIONS: Array<{ key: keyof RawData; label: string }> = [
  { key: 'Steel Price ($)', label: 'Steel' },
  { key: 'Fuel Index', label: 'Fuel' },
  { key: 'Aluminum Index', label: 'Aluminum' },
  { key: 'Copper Price ($)', label: 'Copper' },
  { key: 'Nickel Price ($)', label: 'Nickel' },
  { key: 'Gold Price ($)', label: 'Gold' },
  { key: 'Silver Price ($)', label: 'Silver' },
  { key: 'Lithium Price ($)', label: 'Lithium' },
];
const DEFAULT_KEYS: Array<keyof RawData> = OPTIONS.slice(0, 3).map(o => o.key);
const COLORS: Record<string, string> = {
  'Steel Price ($)': '#FACC15',
  'Fuel Index': '#3182CE',
  'Aluminum Index': '#A0AEC0',
  'Copper Price ($)': '#D53F8C',
  'Nickel Price ($)': '#ED8936',
  'Gold Price ($)': '#ECC94B',
  'Silver Price ($)': '#A0AEC0',
  'Lithium Price ($)': '#38B2AC',
};

const CommodityPriceOutlookTile: React.FC = () => {
  const [data, setData] = useState<RawData[]>([]);
  const [selected, setSelected] = useState<Array<keyof RawData>>(DEFAULT_KEYS);

  useEffect(() => {
    Papa.parse<RawData>('/data/commodity_outlook.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: ({ data: rows }) => {
        setData((rows as RawData[]).filter(r => r.Month));
      },
    });
  }, []);

  const toggle = (key: keyof RawData) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Commodity Price Outlook</h3>
        </div>
        <details className="relative">
          <summary className="flex items-center cursor-pointer text-sm">
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
            <span>Filter</span>
          </summary>
          <ul className="absolute right-0 mt-1 w-48 max-h-56 overflow-auto bg-slate-800 p-2 rounded shadow-lg text-sm space-y-2 z-10">
            {OPTIONS.map(opt => (
              <li key={opt.key.toString()} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected.includes(opt.key)}
                  onChange={() => toggle(opt.key)}
                />
                <span>{opt.label}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="Month" tick={{ fill: 'currentColor', fontSize: 12 }} height={40} />
            <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip formatter={(value) => typeof value === 'number' ? `$${value.toLocaleString()}` : value} />
            <Legend verticalAlign="top" wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
            {selected.map(key => (
              <Line
                key={key as string}
                type="monotone"
                dataKey={key}
                name={OPTIONS.find(o => o.key === key)?.label}
                stroke={COLORS[key as string]}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommodityPriceOutlookTile;