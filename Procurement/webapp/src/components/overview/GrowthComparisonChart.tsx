import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface GrowthPoint {
  month: string;
  mom: number;
  yoy: number;
}

const GrowthComparisonChart: React.FC = () => {
  const [data, setData] = useState<GrowthPoint[]>([]);

  useEffect(() => {
    fetch('/data/sales_summary.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data as any[];
        // sum total_sales per month
        const map: Record<string, number> = {};
        parsed.forEach(r => { map[r.month] = (map[r.month] || 0) + r.total_sales; });
        const months = Object.keys(map).sort();
        const arr: GrowthPoint[] = months.map((m, i) => {
          const sales = map[m];
          const prev = i > 0 ? map[months[i-1]] : sales;
          const prevYear = map[months[i-12]] || prev;
          const mom = prev ? ((sales - prev) / prev) * 100 : 0;
          const yoy = prevYear ? ((sales - prevYear) / prevYear) * 100 : 0;
          return { month: m, mom: parseFloat(mom.toFixed(1)), yoy: parseFloat(yoy.toFixed(1)) };
        });
        setData(arr);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">MoM & YoY Growth</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="%" />
            <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
            <Legend />
            <Bar dataKey="mom" name="MoM %" fill="#8884d8" />
            <Bar dataKey="yoy" name="YoY %" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthComparisonChart;