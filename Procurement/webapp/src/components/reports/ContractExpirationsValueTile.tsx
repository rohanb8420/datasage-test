import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface ExpValueRow { "Contract Name": string; "Value ($)": number; }

const ContractExpirationsValueTile: React.FC = () => {
  const [data, setData] = useState<ExpValueRow[]>([]);
  useEffect(() => {
    Papa.parse<ExpValueRow>("/data/contract_expirations.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data as ExpValueRow[]);
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Contract Values</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Contract Name" />
          <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
          <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
          <Bar dataKey="Value ($)" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContractExpirationsValueTile;