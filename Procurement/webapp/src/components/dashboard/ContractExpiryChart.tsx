import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const msPerDay = 1000 * 60 * 60 * 24;

interface RawContract {
  contract: string;
  start_date: string;
  end_date: string;
}

interface ChartData {
  contract: string;
  startOffset: number;
  duration: number;
  startDate: number;
  endDate: number;
}

const ContractExpiryChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [minStart, setMinStart] = useState<number>(0);

  useEffect(() => {
    Papa.parse("/data/contract_expiry_timeline.csv", {
      header: true,
      download: true,
      complete: (results) => {
        const raw = results.data as RawContract[];
        const parsed = raw.map((d) => ({
          contract: d.contract,
          startDate: new Date(d.start_date).getTime(),
          endDate: new Date(d.end_date).getTime()
        }));
        const min = Math.min(...parsed.map((d) => d.startDate));
        setMinStart(min);
        const chart = parsed.map((d) => ({
          contract: d.contract,
          startOffset: (d.startDate - min) / msPerDay,
          duration: (d.endDate - d.startDate) / msPerDay,
          startDate: d.startDate,
          endDate: d.endDate
        }));
        setData(chart);
      }
    });
  }, []);

  const CustomTooltip: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { contract, startDate, endDate, duration } = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p><strong>{contract}</strong></p>
          <p>Start: {new Date(startDate).toLocaleDateString()}</p>
          <p>End: {new Date(endDate).toLocaleDateString()}</p>
          <p>Duration: {duration} days</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 5, bottom: 20, left: 100 }}
      >
        <CartesianGrid stroke="currentColor" strokeDasharray="3 3" strokeOpacity={0.1} />
        <XAxis
          type="number"
          domain={[0, "dataMax"]}
          stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }}
          tickFormatter={(value) =>
            new Date(minStart + value * msPerDay).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })
          }
        />
        <YAxis type="category" dataKey="contract" stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="startOffset" stackId="a" fill="transparent" />
        <Bar dataKey="duration" stackId="a" fill="#8884d8" name="Duration (days)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ContractExpiryChart;