import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface DataRow {
  Month: string;
  Project_ID: string;
  Budget: number;
  Actual_Spend: number;
}

const COLORS = ["#3F51B5", "#FF9800", "#4CAF50", "#9C27B0", "#2196F3", "#FFC107", "#009688", "#E91E63"];

const BudgetAllocationDonutTile: React.FC = () => {
  const [data, setData] = useState<Array<{ name: string; value: number }>>([]);

  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/budget_vs_actual_by_project.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => {
        const rows = results.data as DataRow[];
        const grouped: { [key: string]: number } = {};
        rows.forEach(({ Project_ID, Budget }) => {
          grouped[Project_ID] = (grouped[Project_ID] || 0) + Budget;
        });
        const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Budget Allocation Mix</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetAllocationDonutTile;