import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface PartnerData {
  partner: string;
  revenue: number;
  fees: number;
}

const DeliveryPerformanceChart: React.FC = () => {
  const [data, setData] = useState<PartnerData[]>([]);
  const partners = ["UberEats", "DoorDash", "GrubHub"];
  const feeRate = 0.2; // 20% fee

  useEffect(() => {
    fetch("/data/raw_sales.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const group: Record<string, { revenue: number; fees: number }> = {};
            (results.data as any[]).forEach((row) => {
              if (row.channel !== "delivery") return;
              const storeId = row.store_id as number;
              const partner = partners[(storeId - 1) % partners.length];
              const rev = parseFloat(row.total_sales as any);
              const fee = rev * feeRate;
              if (!group[partner]) group[partner] = { revenue: 0, fees: 0 };
              group[partner].revenue += rev;
              group[partner].fees += fee;
            });
            const arr = Object.entries(group).map(([partner, vals]) => ({
              partner,
              revenue: parseFloat(vals.revenue.toFixed(2)),
              fees: parseFloat(vals.fees.toFixed(2))
            }));
            setData(arr);
          }
        });
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Delivery Aggregator Performance</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="partner" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" stackId="a" fill="#8884d8" />
            <Bar dataKey="fees" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeliveryPerformanceChart;