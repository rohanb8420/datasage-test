import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface AgingRow { month: string; days_on_hand: number; }

const AgingInventoryTile: React.FC = () => {
  const [data, setData] = useState<AgingRow[]>([]);
  useEffect(() => {
    Papa.parse<AgingRow>("/data/inventory_days_on_hand.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data as AgingRow[]);
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Inventory Days on Hand</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(val: number) => `${val} days`} />
          <Line type="monotone" dataKey="days_on_hand" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgingInventoryTile;