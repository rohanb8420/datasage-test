import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
interface ChartPlaceholderProps { title: string; }
const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 }
];
const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ title }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid
          stroke="var(--chart-grid-stroke)"
          strokeDasharray="3 3"
          strokeOpacity={0.2}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: 'var(--chart-line-neutral)', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: 'var(--chart-line-neutral)', fontSize: 12 }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--chart-line-main)"
          strokeWidth={2}
          dot={{ r: 5, fill: 'var(--chart-line-main)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export default ChartPlaceholder;