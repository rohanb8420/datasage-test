import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Lab {
  month: string;
  total_hours: number;
  total_sales: number;
}

const LaborEfficiencyChart: React.FC = () => {
  const [data, setData] = useState<Lab[]>([]);

  useEffect(() => {
    fetch('/data/labor_efficiency.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data as Lab[];
        const months = Array.from(new Set(parsed.map(r => r.month))).sort();
        const arr = months.map(m => {
          const rec = parsed.find(r => r.month === m);
          return rec ? rec : { month: m, total_hours: 0, total_sales: 0 };
        });
        setData(arr);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Labor Efficiency</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Revenue', angle: 90, position: 'insideRight' }} />
            <Tooltip formatter={(v: number) => typeof v === 'number' && v.toLocaleString()} />
            <Legend />
            <Bar yAxisId="left" dataKey="total_hours" name="Hours Worked" fill="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="total_sales" name="Revenue" stroke="#82ca9d" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LaborEfficiencyChart;