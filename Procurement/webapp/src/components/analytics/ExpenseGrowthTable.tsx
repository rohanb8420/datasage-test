import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface Summary {
  month: string;
  category: string;
  total_amount: number;
}

interface GrowthRow {
  month: string;
  total: number;
  mom?: number;
  yoy?: number;
}

const ExpenseGrowthTable: React.FC = () => {
  const [rows, setRows] = useState<GrowthRow[]>([]);

  useEffect(() => {
    fetch("/data/expenses_summary.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data as Summary[];
            // sum total_amount by month
            const map: Record<string, number> = {};
            data.forEach((r) => {
              map[r.month] = (map[r.month] || 0) + r.total_amount;
            });
            const months = Object.keys(map).sort();
            const gr: GrowthRow[] = months.map((m) => ({ month: m, total: parseFloat(map[m].toFixed(2)) }));
            gr.forEach((r, i) => {
              if (i > 0) {
                const prev = gr[i - 1].total;
                r.mom = parseFloat((((r.total - prev) / prev) * 100).toFixed(2));
              }
              // YoY not available for demo
              r.yoy = undefined;
            });
            setRows(gr);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">MoM & YoY Expense Growth</h3>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full text-gray-700 dark:text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Month</th>
            <th className="px-4 py-2">Total ($)</th>
            <th className="px-4 py-2">MoM %</th>
            <th className="px-4 py-2">YoY %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.month} className="border-t">
              <td className="px-4 py-2">{r.month}</td>
              <td className="px-4 py-2">${r.total.toFixed(2)}</td>
              <td className="px-4 py-2">{r.mom != null ? `${r.mom}%` : 'N/A'}</td>
              <td className="px-4 py-2">{r.yoy != null ? `${r.yoy}%` : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ExpenseGrowthTable;