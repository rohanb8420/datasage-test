import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface VendorMonthly {
  month: string;
  vendor: string;
  total_spend: number;
}

const VendorSpendTrends: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data/vendor_monthly_spend.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const rows = results.data as VendorMonthly[];
            const months = Array.from(new Set(rows.map((r) => r.month))).sort();
            const vendors = Array.from(new Set(rows.map((r) => r.vendor)));
            const series = months.map((m) => {
              const entry: any = { month: m };
              vendors.forEach((v) => {
                const rec = rows.find((r) => r.month === m && r.vendor === v);
                entry[v] = rec ? rec.total_spend : 0;
              });
              return entry;
            });
            setData(series);
          }
        });
      });
  }, []);

  // dynamic colors
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Vendor Spend Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          {data[0] && Object.keys(data[0]).filter((k) => k !== 'month').map((vendor, idx) => (
            <Line key={vendor} type="monotone" dataKey={vendor} stroke={colors[idx % colors.length]} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VendorSpendTrends;