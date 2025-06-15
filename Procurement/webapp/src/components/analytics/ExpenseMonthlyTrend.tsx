import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Summary {
  month: string;
  total_amount: number;
}

const ExpenseMonthlyTrend: React.FC = () => {
  const [data, setData] = useState<Summary[]>([]);

  useEffect(() => {
    fetch('/data/expenses_summary.csv')
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const rows = results.data as Summary[];
            const months = Array.from(new Set(rows.map(r => r.month))).sort();
            const values = months.map(m => ({ month: m, total_amount: parseFloat(rows.filter(r => r.month === m).reduce((sum, r) => sum + r.total_amount, 0).toFixed(2)) }));
            setData(values);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Monthly Expense Trend</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Line type="monotone" dataKey="total_amount" stroke="#FF8042" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseMonthlyTrend;