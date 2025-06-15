import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Summary {
  month: string;
  total_sales?: number;
  total_amount?: number;
}

const RevenueExpensesChart: React.FC = () => {
  const [data, setData] = useState<Summary[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/sales_summary.csv').then((r) => r.text()),
      fetch('/data/expenses_summary.csv').then((r) => r.text())
    ]).then(([salesText, expText]) => {
      const sales = Papa.parse(salesText, { header: true, dynamicTyping: true }).data as any[];
      const exp = Papa.parse(expText, { header: true, dynamicTyping: true }).data as any[];
      const months = Array.from(new Set([...sales.map((r) => r.month), ...exp.map((r) => r.month)])).sort();
      const arr = months.map((m) => {
        const salesVal = sales.filter((r) => r.month === m).reduce((sum, r) => sum + (r.total_sales || 0), 0);
        const expVal = exp.filter((r) => r.month === m).reduce((sum, r) => sum + (r.total_amount || 0), 0);
        return { month: m, total_sales: parseFloat(salesVal.toFixed(2)), total_amount: parseFloat(expVal.toFixed(2)) };
      });
      setData(arr);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Revenue vs. Expenses</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="total_amount" name="Expenses" fill="#82ca9d" stroke="#82ca9d" />
            <Line type="monotone" dataKey="total_sales" name="Revenue" stroke="#8884d8" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueExpensesChart;