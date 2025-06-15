import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Rec {
  month: string;
  dine_in: number;
  takeout: number;
  delivery: number;
}

const SalesChannelOverviewChart: React.FC = () => {
  const [data, setData] = useState<Rec[]>([]);

  useEffect(() => {
    fetch('/data/sales_summary.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data as any[];
        const map: Record<string, { dine_in:number; takeout:number; delivery:number }> = {};
        parsed.forEach(r => {
          if (!map[r.month]) map[r.month] = { dine_in:0, takeout:0, delivery:0 };
          map[r.month][r.channel] += r.total_sales;
        });
        const months = Object.keys(map).sort();
        const arr = months.map(m => ({ month: m, ...map[m] }));
        setData(arr);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Sales by Channel</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="dine_in" stackId="a" name="Dine-in" fill="#8884d8" />
            <Bar dataKey="takeout" stackId="a" name="Takeout" fill="#82ca9d" />
            <Bar dataKey="delivery" stackId="a" name="Delivery" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChannelOverviewChart;