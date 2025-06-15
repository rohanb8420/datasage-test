import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const SafetyIncidentsChart: React.FC = () => {
  const [data, setData] = useState<{ month: string; incidents: number }[]>([]);
  useEffect(() => {
    Papa.parse('/data/supplier_performance/safety_incidents.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow min-h-[15rem] flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Safety Incidents</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip formatter={(val: number) => `${val}`} />
            <Line type="monotone" dataKey="incidents" stroke="#F44336" name="Incidents" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SafetyIncidentsChart;