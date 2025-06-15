import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const QualityDefectRateChart: React.FC = () => {
  const [data, setData] = useState<{ month: string; defect_rate: number }[]>([]);
  useEffect(() => {
    Papa.parse('/data/supplier_performance/quality_defect_rate_trend.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow min-h-[15rem] flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Quality Defect Rate Trend</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <YAxis unit="%" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip formatter={(val: number) => `${val}%`} />
            <Bar dataKey="defect_rate" fill="#FF9800" name="Defect Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QualityDefectRateChart;