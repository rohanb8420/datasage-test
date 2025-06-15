import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";

const Plot = createPlotlyComponent(Plotly);

interface ForecastRow { Forecast_EOY: number; Budget: number; }

const EOYForecastGaugeTile: React.FC = () => {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    Papa.parse("/data/demand_budget_forecasting/forecast_eoy.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => {
        const rows = results.data as ForecastRow[];
        const row = rows[rows.length - 1];
        if (row && row.Forecast_EOY != null && row.Budget) {
          setValue((row.Forecast_EOY / row.Budget) * 100);
        }
      }
    });
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2">Forecast vs End-of-Year</h3>
      {value !== null ? (
        <div style={{ width: '100%', height: '200px' }}>
          <Plot
            data={[
              {
                type: "indicator",
                mode: "gauge+number+delta",
                value,
                delta: { reference: 100, suffix: "%" },
                gauge: { axis: { range: [0, 150], suffix: "%" },
                  bar: { color: "#FFA726" },
                  steps: [
                    { range: [0, 100], color: "lightgray" },
                    { range: [100, 150], color: "crimson" }
                  ]
                }
              }
            ]}
            layout={{ margin: { t: 20, b: 20, l: 40, r: 40 } }}
            config={{ responsive: true, displayModeBar: false }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EOYForecastGaugeTile;