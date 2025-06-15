import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ForecastData {
  date: string;
  forecast: number;
  actual: number;
}

const ForecastVsActualChart: React.FC = () => {
  const [data, setData] = useState<ForecastData[]>([]);

  useEffect(() => {
    Papa.parse("/data/forecast_vs_actual.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsed = (results.data as any[]).map((d) => ({
          date: d.date,
          forecast: +d.forecast,
          actual: +d.actual
        }));
        setData(parsed);
      }
    });
  }, []);

  return (
      <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid stroke="var(--chart-grid-stroke)" strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tick={{ fill: 'currentColor', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: 'currentColor', fontSize: 12 }}
        />
        <Tooltip />
        <Legend
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: 12, color: 'currentColor' }}
        />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="var(--chart-line-secondary)"
          strokeWidth={2}
          dot={{ r: 5, fill: 'var(--chart-line-secondary)' }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke="var(--chart-line-main)"
          strokeWidth={2}
          dot={{ r: 5, fill: 'var(--chart-line-main)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ForecastVsActualChart;