import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CategoryData {
  category: string;
  total_amount: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0"];

const ExpenseBreakdownChart: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);

  useEffect(() => {
    fetch("/data/expenses_summary.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            // get latest month
            const rows = results.data as any[];
            const months = Array.from(new Set(rows.map((r) => r.month))).sort();
            const latest = months[months.length - 1];
            const filtered = rows.filter((r) => r.month === latest);
            const catData: CategoryData[] = filtered.map((r) => ({ category: r.category, total_amount: r.total_amount }));
            setData(catData);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Expense Breakdown by Category</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie data={data} dataKey="total_amount" nameKey="category" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseBreakdownChart;