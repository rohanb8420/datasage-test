import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { itemNames } from "../../config/itemNames";

interface ItemData {
  item_id: string;
  name: string;
  total_sales: number;
}

const TopMenuItemsChart: React.FC = () => {
  const [data, setData] = useState<ItemData[]>([]);

  useEffect(() => {
    fetch('/data/raw_sales.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data as any[];
        const group: Record<string, number> = {};
        parsed.forEach(r => {
          const id = r.item_id;
          group[id] = (group[id] || 0) + r.total_sales;
        });
        const arr: ItemData[] = Object.entries(group)
          .map(([item_id, total_sales]) => ({
            item_id,
            name: itemNames[+item_id] || item_id,
            total_sales: parseFloat(total_sales.toFixed(2))
          }))
          .sort((a, b) => b.total_sales - a.total_sales)
          .slice(0, 5);
        setData(arr);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Top 5 Menu Items</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 20, right: 20, bottom: 20, left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="total_sales" name="Revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopMenuItemsChart;