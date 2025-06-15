import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface DataRow { Month: string; Project_ID: string; Budget: number; Actual_Spend: number; }

interface CumRow { Month: string; Plan: number; Actual: number; }

const CumulativePlanVsActualTile: React.FC = () => {
  const [data, setData] = useState<CumRow[]>([]);

  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/budget_vs_actual_by_project.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => {
        const rows = results.data as DataRow[];
        const byMonth: { [key: string]: { plan: number; actual: number } } = {};
        rows.forEach(({ Month, Budget, Actual_Spend }) => {
          if (!byMonth[Month]) byMonth[Month] = { plan: 0, actual: 0 };
          byMonth[Month].plan += Budget;
          byMonth[Month].actual += Actual_Spend;
        });
        const sortedMonths = Object.keys(byMonth).sort();
        let cumPlan = 0;
        let cumActual = 0;
        const cumData: CumRow[] = sortedMonths.map((m) => {
          cumPlan += byMonth[m].plan;
          cumActual += byMonth[m].actual;
          return { Month: m, Plan: cumPlan, Actual: cumActual };
        });
        setData(cumData);
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Cumulative Plan vs Actual</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Month" />
          <YAxis />
          <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
          <Legend verticalAlign="bottom" height={36} />
          <Line type="monotone" dataKey="Plan" stroke="#3F51B5" />
          <Line type="monotone" dataKey="Actual" stroke="#E91E63" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativePlanVsActualTile;