import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PointData {
  price: number;
  quantity: number;
}

const PriceSensitivityAnalysis: React.FC = () => {
  const [data, setData] = useState<PointData[]>([]);

  useEffect(() => {
    fetch("/data/raw_sales.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const arr = (results.data as any[])
              .map((row) => ({ price: row.unit_price as number, quantity: row.quantity as number }));
            setData(arr);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Price Sensitivity Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="price" name="Price" unit="$" />
          <YAxis type="number" dataKey="quantity" name="Quantity" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Sales" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceSensitivityAnalysis;