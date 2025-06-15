import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Anom {
  month: string;
  anomaly_count: number;
}

const AnomalyAlertsOverview: React.FC = () => {
  const [data, setData] = useState<Anom[]>([]);

  useEffect(() => {
    fetch('/data/anomalies_summary.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data as Anom[];
        const months = Array.from(new Set(parsed.map(r => r.month))).sort();
        const arr = months.map(m => {
          const rec = parsed.find(r => r.month === m);
          return { month: m, anomaly_count: rec ? rec.anomaly_count : 0 };
        });
        setData(arr);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Anomaly Alerts</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="anomaly_count" name="Alerts" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnomalyAlertsOverview;