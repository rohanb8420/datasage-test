import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface RawData {
  Stage: string;
  'Project Count': number;
  'Projected Value ($)': number;
}

interface ChartData {
  name: string;
  count: number;
  value: number;
}

const SourcingPipelineStatusTile: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  useEffect(() => {
    Papa.parse<RawData>('/data/sourcing_pipeline.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = (results.data as RawData[]).filter(r => r.Stage);
        const chartData = rows.map(r => ({
          name: r.Stage,
          count: r['Project Count'],
          value: r['Projected Value ($)'],
        }));
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center space-x-2">
          <ChartBarIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Sourcing Pipeline Status</h3>
        </div>
      </div>
      {/* Chart area */}
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              formatter={(value, name, props) => {
                const entry = (props && props.payload) as ChartData;
                return [`${entry.count} projects`, 'Count'];
              }}
            />
            <Funnel
              dataKey="count"
              data={data}
              nameKey="name"
              isAnimationActive
            >
            <LabelList position="right" fill="#000000" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SourcingPipelineStatusTile;