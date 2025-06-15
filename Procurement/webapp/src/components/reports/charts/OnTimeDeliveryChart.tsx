import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const OnTimeDeliveryChart: React.FC = () => {
  const [data, setData] = useState<{ supplier: string; rate: number }[]>([]);
  useEffect(() => {
    Papa.parse('/data/supplier_performance/top_5_suppliers_on_time_delivery.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow min-h-[15rem] flex flex-col">
      <h3 className="text-lg font-semibold mb-2">On-Time Delivery Rate</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="supplier" tick={{ angle: -30, textAnchor: 'end', fill: 'currentColor', fontSize: 12 }} interval={0} height={40} />
            <YAxis unit="%" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip formatter={(val: number) => `${val}%`} />
            <Bar dataKey="rate" fill="#4CAF50" name="On-Time %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OnTimeDeliveryChart;