import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChannelData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const SalesByChannelChart: React.FC = () => {
  const [data, setData] = useState<ChannelData[]>([]);

  useEffect(() => {
    fetch("/data/raw_sales.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const group: Record<string, number> = {};
            (results.data as any[]).forEach((row) => {
              const ch = row.channel as string;
              const ts = parseFloat(row.total_sales as any);
              group[ch] = (group[ch] || 0) + ts;
            });
            const arr = Object.entries(group).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
            setData(arr);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Sales by Channel</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesByChannelChart;