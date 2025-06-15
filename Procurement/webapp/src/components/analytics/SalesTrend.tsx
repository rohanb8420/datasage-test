import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Helper to get ISO week number
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

interface RawSales {
  date: string;
  total_sales: number;
}

const SalesTrend: React.FC = () => {
  const [rawData, setRawData] = useState<RawSales[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [chartData, setChartData] = useState<{ period: string; total_sales: number }[]>([]);

  useEffect(() => {
    fetch("/data/raw_sales.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse<RawSales>(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data.map((row) => ({ date: row.date, total_sales: row.total_sales }));
            setRawData(data);
          }
        });
      });
  }, []);

  useEffect(() => {
    const group: Record<string, number> = {};
    rawData.forEach((r) => {
      const d = new Date(r.date);
      let key: string;
      if (period === "daily") {
        key = r.date;
      } else if (period === "weekly") {
        key = `${d.getFullYear()}-W${getWeekNumber(d)}`;
      } else {
        key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      }
      group[key] = (group[key] || 0) + r.total_sales;
    });
    const arr = Object.entries(group)
      .map(([period, total_sales]) => ({ period, total_sales: parseFloat(total_sales.toFixed(2)) }))
      .sort((a, b) => (a.period > b.period ? 1 : -1));
    setChartData(arr);
  }, [rawData, period]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Sales Trend</h3>
      <div className="mb-2">
        <label className="mr-2">Period:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="border rounded px-2 py-1"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total_sales" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesTrend;