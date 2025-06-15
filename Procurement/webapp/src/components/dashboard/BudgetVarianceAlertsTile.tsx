import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface RawRow { Project_ID: string; Variance_Percent: number; }
interface DataItem { name: string; value: number; }

const BudgetVarianceAlertsTile: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  useEffect(() => {
    Papa.parse<RawRow>('/data/demand_budget_forecasting/budget_variance_alerts.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as RawRow[];
        const chartData = rows.map(r => ({ name: r.Project_ID, value: r.Variance_Percent }));
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      <div className="flex items-center space-x-2 h-8">
        <ChartBarIcon className="h-6 w-6" />
        <h3 className="text-lg font-semibold">Budget Variance Alerts</h3>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={40} tick={{ fill: 'currentColor', fontSize: 12 }} />
            <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip formatter={(val: number) => `${val}%`} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
            <Bar dataKey="value">
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.value >= 0 ? '#F44336' : '#4CAF50'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetVarianceAlertsTile;