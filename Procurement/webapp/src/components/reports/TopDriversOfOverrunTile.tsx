import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface DataRow { Driver: string; Impact: number; }

const TopDriversOfOverrunTile: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/top_drivers_of_overrun.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data as DataRow[])
    });
  }, []);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Top Drivers of Overrun</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Driver" angle={-25} textAnchor="end" interval={0} height={40} />
          <YAxis tickFormatter={(val) => `${val}%`} />
          <Tooltip formatter={(val: number) => `${val}%`} />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="Impact" fill="#FF9800" name="Impact (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopDriversOfOverrunTile;