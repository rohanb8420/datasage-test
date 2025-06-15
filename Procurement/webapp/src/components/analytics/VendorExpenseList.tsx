import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface RecordData {
  vendor: string;
  category: string;
  amount: number;
}

const VendorExpenseList: React.FC = () => {
  const [data, setData] = useState<RecordData[]>([]);

  useEffect(() => {
    fetch("/data/raw_expenses.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const rows = results.data as RecordData[];
            const group: Record<string, number> = {};
            rows.forEach((r) => {
              const key = `${r.vendor}||${r.category}`;
              group[key] = (group[key] || 0) + r.amount;
            });
            const list = Object.entries(group).map(([key, total]) => {
              const [vendor, category] = key.split('||');
              return { vendor, category, amount: parseFloat(total.toFixed(2)) };
            });
            // sort by decreasing spend amount
            list.sort((a, b) => b.amount - a.amount);
            setData(list);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Vendor Spend by Category</h3>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full text-gray-700 dark:text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2">Vendor</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Total Spend ($)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{r.vendor}</td>
              <td className="px-4 py-2">{r.category}</td>
              <td className="px-4 py-2">{r.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default VendorExpenseList;