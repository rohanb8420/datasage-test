import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Food", value: 400 },
  { name: "Staff", value: 300 },
  { name: "Maintenance", value: 200 },
  { name: "Utilities", value: 100 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExpenseCategoryChart: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h2 className="text-xl mb-2 text-gray-900 dark:text-gray-100">Expense Categories</h2>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ExpenseCategoryChart;