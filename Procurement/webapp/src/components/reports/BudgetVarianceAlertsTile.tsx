import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, Legend } from "recharts";

interface DataRow { Project_ID: string; Variance_Percent: number; }

const BudgetVarianceAlertsTile: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/budget_variance_alerts.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data as DataRow[])
    });
  }, []);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Budget Variance Alerts</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Project_ID" angle={-25} textAnchor="end" interval={0} height={40} />
          <YAxis tickFormatter={(val) => `${val}%`} />
          <Tooltip formatter={(val: number) => `${val}%`} />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="Variance_Percent" name="Variance (%)">
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.Variance_Percent >= 0 ? "#F44336" : "#4CAF50"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetVarianceAlertsTile;