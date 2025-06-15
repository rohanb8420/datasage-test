import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ComplianceRow { Category: string; Value: number; }

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

const ContractCompliancePieTile: React.FC = () => {
  const [data, setData] = useState<ComplianceRow[]>([]);

  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/contract_compliance.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data as ComplianceRow[])
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Contract Compliance Mix</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            dataKey="Value"
            nameKey="Category"
            cx="30%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val: number) => `${val}%`} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContractCompliancePieTile;