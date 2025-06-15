import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface DataRow { Category: string; Budget: number; }

const COLORS = ["#3F51B5", "#FF9800", "#4CAF50", "#9C27B0", "#2196F3", "#FFC107"];

const BudgetAllocationCategoryPieTile: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  useEffect(() => {
    Papa.parse<DataRow>("/data/demand_budget_forecasting/budget_allocation_by_category.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data.filter((d) => d.Category));
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Budget Allocation by Category</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              dataKey="Budget"
              nameKey="Category"
              cx="30%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetAllocationCategoryPieTile;