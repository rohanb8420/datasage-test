import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface DataRow { Month: string; Forecast: number; Actual: number; }

const ForecastVsActualSpendTile: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/forecast_vs_actual_spend.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data as DataRow[])
    });
  }, []);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Forecast vs Actual Spend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Month" />
          <YAxis tickFormatter={(val) => `₹${val.toLocaleString()}`} />
          <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
          <Legend verticalAlign="bottom" height={36} />
          <Line type="monotone" dataKey="Forecast" stroke="#FFA726" name="Forecast" />
          <Line type="monotone" dataKey="Actual" stroke="#4CAF50" name="Actual" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastVsActualSpendTile;