import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Rev {
  month: string;
  avg_rating: number;
}

const ReviewSentimentTrend: React.FC = () => {
  const [data, setData] = useState<Rev[]>([]);

  useEffect(() => {
    fetch('/data/review_summary.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data as Rev[];
        setData(parsed.sort((a, b) => a.month.localeCompare(b.month)));
      });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Review Sentiment Trend</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Area type="monotone" dataKey="avg_rating" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReviewSentimentTrend;