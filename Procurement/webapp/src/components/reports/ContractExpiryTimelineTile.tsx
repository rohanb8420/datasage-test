import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface ExpRow { "Expiration Date": string; }

const ContractExpiryTimelineTile: React.FC = () => {
  const [data, setData] = useState<Array<{ month: string; count: number }>>([]);
  useEffect(() => {
    Papa.parse<ExpRow>("/data/contract_expirations.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const map: Record<string, number> = {};
        (results.data as ExpRow[]).forEach((r) => {
          const month = r["Expiration Date"].slice(0, 7);
          map[month] = (map[month] || 0) + 1;
        });
        const chartData = Object.keys(map)
          .sort()
          .map((m) => ({ month: m, count: map[m] }));
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Contracts Expiring Per Month</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" name="Expirations" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContractExpiryTimelineTile;