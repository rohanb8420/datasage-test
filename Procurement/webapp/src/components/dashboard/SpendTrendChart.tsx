import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DataPoint {
  date: string;
  spend: number;
  ytd: number;
}

const SpendTrendChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    Papa.parse("/data/spend_trend.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsed = (results.data as any[]).map((d) => ({
          date: d.date,
          spend: +d.spend,
          ytd: +d.ytd
        }));
        setData(parsed);
      }
    });
  }, []);

  return (
    <div className="h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
          <CartesianGrid stroke="currentColor" strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tick={{ angle: -30, textAnchor: 'end', fill: 'currentColor', fontSize: 12, textOverflow: 'ellipsis' }}
            height={60}
            interval={0}
          />
          <YAxis axisLine={false} tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 12, color: 'currentColor' }} />
          <Line type="monotone" dataKey="spend" name="Spend" stroke="var(--chart-line-main)" strokeWidth={2} dot={{ r: 5, fill: 'var(--chart-line-main)' }} />
          <Line type="monotone" dataKey="ytd" name="YTD" stroke="var(--chart-line-secondary)" strokeWidth={2} dot={{ r: 5, fill: 'var(--chart-line-secondary)' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendTrendChart;