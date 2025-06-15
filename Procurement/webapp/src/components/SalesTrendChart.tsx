import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 700 },
  { name: "May", value: 600 },
  { name: "Jun", value: 800 },
  { name: "Jul", value: 750 },
  { name: "Aug", value: 900 },
  { name: "Sep", value: 850 },
  { name: "Oct", value: 950 },
  { name: "Nov", value: 1000 },
  { name: "Dec", value: 1100 }
];

const SalesTrendChart: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <h2 className="text-xl mb-2 text-gray-900 dark:text-gray-100">Sales Trend</h2>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesTrendChart;