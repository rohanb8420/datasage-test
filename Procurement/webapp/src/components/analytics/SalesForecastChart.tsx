import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface ForecastPoint {
  period: string;
  forecast: number;
  lower: number;
  upper: number;
}

const SalesForecastChart: React.FC = () => {
  const [days, setDays] = useState<number>(7);
  const [data, setData] = useState<ForecastPoint[]>([]);

  const generateData = (count: number) => {
    const arr: ForecastPoint[] = [];
    for (let i = 1; i <= count; i++) {
      const f = parseFloat((Math.random() * 1000 + 500).toFixed(2));
      arr.push({
        period: `Day ${i}`,
        forecast: f,
        lower: parseFloat((f * 0.9).toFixed(2)),
        upper: parseFloat((f * 1.1).toFixed(2))
      });
    }
    return arr;
  };

  useEffect(() => {
    setData(generateData(days));
  }, [days]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Sales Forecast</h3>
      <div className="mb-2">
        <button
          onClick={() => setDays(7)}
          className={`px-2 py-1 mr-2 rounded ${days === 7 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >7d</button>
        <button
          onClick={() => setDays(30)}
          className={`px-2 py-1 mr-2 rounded ${days === 30 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >30d</button>
        <button
          onClick={() => setDays(90)}
          className={`px-2 py-1 rounded ${days === 90 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >90d</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="upper" stroke="none" fill="url(#colorCI)" activeDot={false} />
          <Line type="monotone" dataKey="forecast" stroke="#8884d8" dot />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesForecastChart;