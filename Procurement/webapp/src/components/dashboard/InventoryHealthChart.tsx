import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from "recharts";

const InventoryHealthChart: React.FC = () => {
  const [avgRisk, setAvgRisk] = useState<number>(0);

  useEffect(() => {
    Papa.parse("/data/inventory_health.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        const values = (results.data as any[]).map((d) => parseFloat(d.risk_score) * 100);
        const total = values.reduce((sum, v) => sum + v, 0);
        const avg = values.length ? total / values.length : 0;
        setAvgRisk(avg);
      }
    });
  }, []);

  const data = [{ name: "Risk", value: avgRisk }];

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="80%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise
            dataKey="value"
            fill="#e74c3c"
          />
          <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
        {`${Math.round(avgRisk)}%`}
      </div>
    </div>
  );
};

export default InventoryHealthChart;