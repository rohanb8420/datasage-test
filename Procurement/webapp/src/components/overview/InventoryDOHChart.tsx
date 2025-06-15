import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DOH {
  month: string;
  days_on_hand: number;
}

const InventoryDOHChart: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    fetch('/data/inventory_days_on_hand.csv')
      .then(res => res.text())
      .then(text => {
        const parsed = Papa.parse(text, { header: true, dynamicTyping: true }).data as DOH[];
        const months = Array.from(new Set(parsed.map(r => r.month))).sort();
        const latest = months[months.length - 1];
        const rec = parsed.find(r => r.month === latest);
        setValue(rec ? rec.days_on_hand : 0);
      });
  }, []);

  const data = [{ name: 'Days on Hand', value }];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col h-96">
      <h3 className="text-lg font-semibold mb-2">Inventory Days on Hand</h3>
      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={data} startAngle={180} endAngle={0}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" fill="#8884d8" />
            <Legend />
            <Tooltip formatter={(v: number) => `${v} days`} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryDOHChart;