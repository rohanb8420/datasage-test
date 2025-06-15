import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface SummaryRow { item_id: number; stock_turnover_rate: number; }

const InventoryTurnoverRatioTile: React.FC = () => {
  const [data, setData] = useState<SummaryRow[]>([]);
  useEffect(() => {
    Papa.parse<SummaryRow>("/data/inventory_summary.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data as SummaryRow[]).filter((r) => r.item_id != null);
        setData(rows);
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Inventory Turnover Ratio</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="item_id" />
          <YAxis />
          <Tooltip formatter={(val: number) => val.toFixed(2)} />
          <Bar dataKey="stock_turnover_rate" name="Turnover" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InventoryTurnoverRatioTile;