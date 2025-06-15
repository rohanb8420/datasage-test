import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { itemNames } from "../../config/itemNames";

interface SellerData {
  item_id: string;
  name: string;
  total_sales: number;
}

const TopSellers: React.FC = () => {
  const [data, setData] = useState<SellerData[]>([]);

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
              const id = `${row.item_id}`;
              const ts = parseFloat(row.total_sales as any);
              group[id] = (group[id] || 0) + ts;
            });
            const arr: SellerData[] = Object.entries(group)
              .map(([item_id, total_sales]) => ({
                item_id,
                name: itemNames[+item_id] || item_id,
                total_sales: parseFloat(total_sales.toFixed(2))
              }))
              .sort((a, b) => b.total_sales - a.total_sales)
              .slice(0, 5);
            setData(arr);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Top 5 Sellers</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_sales" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellers;