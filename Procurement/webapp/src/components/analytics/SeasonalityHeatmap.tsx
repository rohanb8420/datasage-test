import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

interface CellData {
  day: number;
  month: number;
  value: number;
}

const SeasonalityHeatmap: React.FC = () => {
  const [cells, setCells] = useState<CellData[]>([]);

  useEffect(() => {
    fetch("/data/raw_sales.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const map: Record<string, number> = {};
            let maxVal = 0;
            (results.data as any[]).forEach((row) => {
              const d = new Date(row.date as string);
              const m = d.getMonth();
              const day = d.getDay();
              const key = `${m}-${day}`;
              const val = row.total_sales as number;
              map[key] = (map[key] || 0) + val;
              if (map[key] > maxVal) maxVal = map[key];
            });
            const arr: CellData[] = [];
            Object.entries(map).forEach(([k, v]) => {
              const [m, day] = k.split('-').map(Number);
              arr.push({ month: m, day, value: v });
            });
            setCells(arr);
          }
        });
      });
  }, []);

  // find max for scaling
  const maxValue = cells.reduce((max, c) => Math.max(max, c.value), 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Seasonality Heatmap</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-1"></th>
            {monthNames.map((mn) => (
              <th key={mn} className="border p-1 text-xs">{mn}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dayNames.map((dn, dayIdx) => (
            <tr key={dn}>
              <td className="border p-1 text-xs font-semibold">{dn}</td>
              {monthNames.map((_, mIdx) => {
                const cell = cells.find((c) => c.month === mIdx && c.day === dayIdx);
                const val = cell ? cell.value : 0;
                const opacity = maxValue ? val / maxValue : 0;
                return (
                  <td
                    key={`${mIdx}-${dayIdx}`}
                    className="border p-1"
                    style={{ backgroundColor: `rgba(66,153,225,${0.1 + 0.8 * opacity})` }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonalityHeatmap;