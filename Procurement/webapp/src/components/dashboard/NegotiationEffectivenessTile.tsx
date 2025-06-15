import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface DataPoint {
  Metric: string;
  Value: number;
}

const NegotiationEffectivenessTile: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  useEffect(() => {
    Papa.parse<DataPoint>('/data/negotiation_effectiveness.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = (results.data as DataPoint[]).filter(r => r.Metric);
        setData(rows);
      },
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🤝</span>
          <h3 className="text-lg font-semibold">Negotiation Effectiveness</h3>
        </div>
      </div>
      {/* KPI stats */}
      <div className="flex-1 flex items-center justify-around">
        {data.map((d, idx) => (
          <div key={idx} className="text-center">
            <div className="text-3xl font-bold">
              {d.Metric.includes('%') ? `${d.Value}%` : d.Value}
            </div>
            <div className="text-sm text-gray-400 mt-1">{d.Metric}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NegotiationEffectivenessTile;