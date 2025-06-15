import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface RawInventoryRow { date: string; beginning_stock: number; ending_stock: number; }

const StockLevelsTile: React.FC = () => {
  const [data, setData] = useState<Array<{ date: string; beginning: number; ending: number }>>([]);
  useEffect(() => {
    Papa.parse<RawInventoryRow>("/data/raw_inventory.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as RawInventoryRow[];
        const map: Record<string, { beginning: number; ending: number }> = {};
        rows.forEach((r) => {
          const { date, beginning_stock, ending_stock } = r;
          if (!map[date]) map[date] = { beginning: 0, ending: 0 };
          map[date].beginning += beginning_stock;
          map[date].ending += ending_stock;
        });
        const chartData = Object.keys(map)
          .sort()
          .map((date) => ({ date, beginning: map[date].beginning, ending: map[date].ending }));
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Stock Levels vs Ending Stock</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="beginning" name="Beginning" stroke="#8884d8" />
          <Line type="monotone" dataKey="ending" name="Ending" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockLevelsTile;