import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface ExpenseRecord {
  date: string;
  category: string;
  vendor: string;
  amount: number;
}

const AbnormalExpenseAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ExpenseRecord[]>([]);

  useEffect(() => {
    fetch("/data/raw_expenses.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data as ExpenseRecord[];
            const amounts = data.map((r) => r.amount);
            const mean = amounts.reduce((sum, v) => sum + v, 0) / amounts.length;
            const variance = amounts.reduce((sum, v) => sum + (v - mean) ** 2, 0) / amounts.length;
            const std = Math.sqrt(variance);
            const threshold = mean + 2 * std;
            const outliers = data.filter((r) => r.amount > threshold);
            setAlerts(outliers);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Abnormal Purchase Alerts</h3>
      <table className="min-w-full text-gray-700 dark:text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Vendor</th>
            <th className="px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((r, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{r.date}</td>
              <td className="px-4 py-2">{r.category}</td>
              <td className="px-4 py-2">{r.vendor}</td>
              <td className="px-4 py-2">${r.amount.toFixed(2)}</td>
            </tr>
          ))}
          {alerts.length === 0 && (
            <tr><td colSpan={4} className="px-4 py-2 text-center">No anomalies detected</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AbnormalExpenseAlerts;