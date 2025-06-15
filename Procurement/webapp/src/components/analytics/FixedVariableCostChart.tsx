import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Summary {
  month: string;
  category: string;
  total_amount: number;
}

const FixedVariableCostChart: React.FC = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const fixedCategories = ['rent', 'utilities'];

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
            const latest = months[months.length - 1];
            const filtered = rows.filter(r => r.month === latest);
            let fixedTotal = 0;
            let variableTotal = 0;
            filtered.forEach(r => {
              if (fixedCategories.includes(r.category)) fixedTotal += r.total_amount;
              else variableTotal += r.total_amount;
            });
            setData([
              { name: 'Fixed Costs', value: parseFloat(fixedTotal.toFixed(2)) },
              { name: 'Variable Costs', value: parseFloat(variableTotal.toFixed(2)) }
            ]);
          }
        });
      });
  }, []);

  const COLORS = ['#8884d8', '#82ca9d'];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Fixed vs Variable Costs</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
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

export default FixedVariableCostChart;