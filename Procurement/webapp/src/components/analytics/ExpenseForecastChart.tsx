import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ForecastPoint {
  period: string;
  forecast: number;
}

const ExpenseForecastChart: React.FC = () => {
  const [period, setPeriod] = useState<30 | 90>(30);
  const [data, setData] = useState<ForecastPoint[]>([]);

  const generateData = (count: number) => {
    const arr: ForecastPoint[] = [];
    for (let i = 1; i <= count; i++) {
      const f = parseFloat((Math.random() * 5000 + 1000).toFixed(2));
      arr.push({ period: `Day ${i}`, forecast: f });
    }
    return arr;
  };

  useEffect(() => {
    setData(generateData(period));
  }, [period]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Expense Forecast</h3>
      <div className="mb-2">
        <button
          onClick={() => setPeriod(30)}
          className={`px-2 py-1 mr-2 rounded ${period === 30 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >30d</button>
        <button
          onClick={() => setPeriod(90)}
          className={`px-2 py-1 rounded ${period === 90 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >90d</button>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" hide />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Line type="monotone" dataKey="forecast" stroke="#8884d8" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseForecastChart;