import React, { useState, useEffect } from "react";
import Papa from "papaparse";
// Use factory to bind Plotly.js build for 3D plotting
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
const Plot = createPlotlyComponent(Plotly);
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RiskData {
  supplier: string;
  impact: number;
  likelihood: number;
  risk_level: string;
  time_to_recover: number;
}

const SupplierRiskHeatmapTile: React.FC = () => {
  const [data, setData] = useState<RiskData[]>([]);

  // Color mapping for risk levels
  const COLOR_MAP: Record<string, string> = {
    High: '#f44336',
    Medium: '#ffb300',
    Low: '#4caf50',
  };
  // Legend items
  const legendPayload = Object.entries(COLOR_MAP).map(([key, color]) => ({
    value: key,
    type: 'circle',
    id: key,
    color,
  }));
  // Custom tooltip content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { supplier, risk_level } = payload[0].payload;
      return (
        <div className="bg-white text-black p-2 rounded shadow">
          <div><strong>{supplier}</strong></div>
          <div>Risk Level: {risk_level}</div>
        </div>
      );
    }
    return null;
  };
  useEffect(() => {
    // Load risk data including time to recover
    Papa.parse('/data/supplier_risk.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => {
        setData(results.data as RiskData[]);
      }
    });
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-[#1e1e1e] border border-stone-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 transition-shadow duration-300 h-80 p-4 flex flex-col text-slate-800 dark:text-white relative overflow-hidden">
      <div className="flex items-center justify-between h-8">
        <div className="flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Supplier Risk Heatmap</h3>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {data.length > 0 && (() => {
          // Build Plotly traces per risk level
          const traces = Object.entries(COLOR_MAP).map(([level, color]) => {
            const filtered = data.filter((d) => d.risk_level === level);
            return {
              x: filtered.map((d) => d.impact),
              y: filtered.map((d) => d.likelihood),
              z: filtered.map((d) => d.time_to_recover),
              text: filtered.map((d) => d.supplier),
              mode: 'markers',
              type: 'scatter3d' as const,
              name: level,
            marker: { size: 10, color }
            };
          });
          const layout = {
            autosize: true,
            margin: { l: 60, r: 60, b: 60, t: 60 },
            // Transparent backgrounds to inherit tile color
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            scene: {
              xaxis: {
                title: 'Impact',
                showline: true,
                linecolor: '#444',
                linewidth: 2,
                showgrid: false,
                autorange: false,
                range: [1, 5]
              },
              yaxis: {
                title: 'Likelihood',
                showline: true,
                linecolor: '#444',
                linewidth: 2,
                showgrid: false,
                autorange: false,
                range: [1, 5]
              },
              zaxis: {
                title: 'Time to Recover',
                showline: true,
                linecolor: '#444',
                linewidth: 2,
                showgrid: false,
                autorange: false,
                range: [0, 10]
              },
              camera: { eye: { x: 1.2, y: 1.2, z: 1.2 } }
            }
          };
          return (
        <Plot
          data={traces}
          layout={layout}
          config={{ responsive: true }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
          );
        })()}
      </div>
    </div>
  );
};

export default SupplierRiskHeatmapTile;