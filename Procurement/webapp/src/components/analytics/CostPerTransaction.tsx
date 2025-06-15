import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ExpenseSummary {
  month: string;
  total_amount: number;
}
interface SalesSummary {
  month: string;
  total_orders: number;
}
interface DataPoint {
  month: string;
  cost_per_transaction: number;
}

const CostPerTransaction: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/expenses_summary.csv').then((r) => r.text()),
      fetch('/data/sales_summary.csv').then((r) => r.text())
    ]).then(([expText, salesText]) => {
      const exp = Papa.parse(expText, { header: true, dynamicTyping: true }).data as any[];
      const sales = Papa.parse(salesText, { header: true, dynamicTyping: true }).data as any[];
      // sum expenses by month
      const expMap: Record<string, number> = {};
      exp.forEach((r) => { expMap[r.month] = (expMap[r.month] || 0) + r.total_amount; });
      // sum orders by month
      const ordMap: Record<string, number> = {};
      sales.forEach((r) => { ordMap[r.month] = (ordMap[r.month] || 0) + r.total_orders; });
      // build data
      const months = Array.from(new Set([...Object.keys(expMap), ...Object.keys(ordMap)])).sort();
      const dp: DataPoint[] = months.map((m) => ({
        month: m,
        cost_per_transaction: ordMap[m] ? parseFloat((expMap[m] / ordMap[m]).toFixed(2)) : 0
      }));
      setData(dp);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Cost per Transaction</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Bar dataKey="cost_per_transaction" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostPerTransaction;