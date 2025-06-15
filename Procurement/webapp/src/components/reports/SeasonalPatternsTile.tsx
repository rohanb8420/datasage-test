import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface DataRow { Month: string; Value: number; }

const SeasonalPatternsTile: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/seasonal_patterns.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data as DataRow[])
    });
  }, []);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Seasonal Patterns</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Value" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeasonalPatternsTile;