import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";

const Plot = createPlotlyComponent(Plotly);

interface DataRow {
  Month: string;
  Project_ID: string;
  Budget: number;
  Actual_Spend: number;
}

const BudgetVsActualByProjectTile: React.FC = () => {
  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const [chartData, setChartData] = useState<{
    x: string[];
    spentPct: number[];
    remainingPct: number[];
  } | null>(null);

  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/budget_vs_actual_by_project.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => {
        const rows = results.data as DataRow[];
        setDataRows(rows);
      }
    });
  }, []);

  useEffect(() => {
    if (dataRows.length === 0) return;
    const grouped: { [key: string]: { totalBudget: number; totalSpent: number } } = {};
    dataRows.forEach((row) => {
      const { Project_ID, Budget, Actual_Spend } = row;
      if (!grouped[Project_ID]) {
        grouped[Project_ID] = { totalBudget: 0, totalSpent: 0 };
      }
      grouped[Project_ID].totalBudget += Budget;
      grouped[Project_ID].totalSpent += Actual_Spend;
    });
    const x = Object.keys(grouped);
    const spentPct = x.map((pid) => grouped[pid].totalSpent / grouped[pid].totalBudget);
    const remainingPct = x.map(
      (pid) => (grouped[pid].totalBudget - grouped[pid].totalSpent) / grouped[pid].totalBudget
    );
    setChartData({ x, spentPct, remainingPct });
  }, [dataRows]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Budget vs Actual by Project</h3>
      {chartData ? (
        <div style={{ width: '100%', height: '200px' }}>
          <Plot
            data={[
              { x: chartData.x, y: chartData.spentPct, type: "bar", name: "Spent", marker: { color: "crimson" } },
              { x: chartData.x, y: chartData.remainingPct, type: "bar", name: "Remaining", marker: { color: "lightgray" } }
            ]}
            layout={{
              barmode: "stack",
              xaxis: { title: "Project ID" },
              yaxis: { title: "Percentage of Budget", tickformat: "%" },
              margin: { t: 20, l: 40, r: 20, b: 40 }
            }}
            config={{ responsive: true, displayModeBar: false }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BudgetVsActualByProjectTile;