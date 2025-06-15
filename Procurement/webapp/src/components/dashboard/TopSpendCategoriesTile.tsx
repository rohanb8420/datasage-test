import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { TagIcon } from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CategoryData {
  category: string;
  spend: number;
}

const TopSpendCategoriesTile: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);

  useEffect(() => {
    Papa.parse("/data/top_spend_categories.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data as CategoryData[]);
      },
    });
  }, []);

  return (
  <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      {/* Header */}
      <div className="flex items-center space-x-2 h-8">
        <TagIcon className="h-6 w-6" />
        <h3 className="text-lg font-semibold">Top Spend Categories</h3>
      </div>
      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
            <CartesianGrid stroke="currentColor" strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="category"
              stroke="currentColor"
              tick={{ angle: -30, textAnchor: 'end', fill: 'currentColor', fontSize: 12, textOverflow: 'ellipsis' }}
              height={60}
              interval={0}
            />
            <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Bar dataKey="spend" fill="#8884d8" name="Spend" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopSpendCategoriesTile;