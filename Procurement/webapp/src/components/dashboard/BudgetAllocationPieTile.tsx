import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartPieIcon } from '@heroicons/react/24/outline';

interface RawRow { Month: string; Project_ID: string; Budget: number; Actual_Spend: number; }
interface DataItem { name: string; value: number; }

const COLORS = ['#3F51B5', '#FF9800', '#4CAF50', '#9C27B0', '#2196F3'];

const BudgetAllocationPieTile: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  useEffect(() => {
    Papa.parse<RawRow>('/data/demand_budget_forecasting/budget_vs_actual_by_project.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as RawRow[];
        const grouped: Record<string, number> = {};
        rows.forEach(({ Project_ID, Budget }) => {
          grouped[Project_ID] = (grouped[Project_ID] || 0) + Budget;
        });
        const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      <div className="flex items-center space-x-2 h-8">
        <ChartPieIcon className="h-6 w-6" />
        <h3 className="text-lg font-semibold">Budget Allocation</h3>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="90%" height="90%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'currentColor', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetAllocationPieTile;