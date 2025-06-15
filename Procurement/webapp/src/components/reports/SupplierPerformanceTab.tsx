import React, { useState, useEffect } from "react";
import Papa from "papaparse";
// Use factory to bind Plotly.js build (basic-dist) for 3D plotting
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
const Plot = createPlotlyComponent(Plotly);
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

/* -------------------------------------------------------------------------- */
/*                               CHART COMPONENTS                             */
/* -------------------------------------------------------------------------- */

// On‑Time Delivery Rate
const OnTimeDeliveryRateChart: React.FC = () => {
  const [data, setData] = useState<Array<{ supplier: string; rate: number }>>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/top_5_suppliers_on_time_delivery.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-3 min-h-[15rem] flex flex-col justify-between">
      <h3 className="text-lg font-semibold mb-2">On‑Time Delivery Rate</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 30, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="supplier"
            angle={-25}
            textAnchor="end"
            interval={0}
            dy={10}
            height={40}
            tick={{ fill: '#444', fontSize: 12 }}
          />
          <YAxis unit="%" tick={{ fill: '#444', fontSize: 12 }} />
          <Tooltip formatter={(val: number) => `${val}%`} />
          <Bar dataKey="rate" fill="#4CAF50" name="On‑Time %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Lowest Quality Defect Rate
const QualityDefectRateChart: React.FC = () => {
  const [data, setData] = useState<Array<{ supplier: string; defect_rate: number }>>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/least_quality_defect_rate_suppliers.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-3 min-h-[15rem] flex flex-col justify-between">
      <h3 className="text-lg font-semibold mb-2">Lowest Quality Defect Rate</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 30, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="supplier"
            angle={-25}
            textAnchor="end"
            interval={0}
            dy={10}
            height={40}
            tick={{ fill: '#444', fontSize: 12 }}
          />
          <YAxis unit="%" tick={{ fill: '#444', fontSize: 12 }} />
          <Tooltip formatter={(val: number) => `${val}%`} />
          <Bar dataKey="defect_rate" fill="#FF9800" name="Defect %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Lead‑Time Variability (currently not rendered in the tab but kept for reuse)
const LeadTimeVariabilityChart: React.FC = () => {
  const [data, setData] = useState<Array<{ month: string; variability: number }>>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/lead_time_variability.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-3 min-h-[15rem] flex flex-col justify-between">
      <h3 className="text-lg font-semibold mb-2">Lead‑Time Variability</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 30, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            angle={-25}
            textAnchor="end"
            interval={0}
            dy={10}
            height={40}
            tick={{ fill: '#444', fontSize: 12 }}
          />
          <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(val: number) => `${val} days`} />
          <Bar dataKey="variability" fill="#2196F3" name="Variability (days)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Supplier Risk Score
const SupplierRiskScoreChart: React.FC = () => {
  const [data, setData] = useState<Array<{ supplier: string; risk_score: number }>>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/supplier_risk_score.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-4">
      <h3 className="text-lg font-semibold mb-2">Supplier Risk Score</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="supplier" />
          <YAxis tick={{ fill: '#444', fontSize: 12 }} />
          <Tooltip formatter={(val: number) => val.toFixed(2)} />
          <Bar dataKey="risk_score" fill="#F44336" name="Risk Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Predicted Delivery Delays
const PredictedDeliveryDelaysChart: React.FC = () => {
  const [data, setData] = useState<Array<{ month: string; predicted_delay: number }>>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/predicted_delivery_delays.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-4">
      <h3 className="text-lg font-semibold mb-2">Predicted Delivery Delays</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(val: number) => `${val} days`} />
          <Line type="monotone" dataKey="predicted_delay" stroke="#9C27B0" name="Predicted Delay" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Top 5 Suppliers by Performance Score
const TopSuppliersPerformanceChart: React.FC = () => {
  const [data, setData] = useState<Array<{ supplier: string; performance_score: number }>>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/top_5_suppliers_by_performance_score.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-4">
      <h3 className="text-lg font-semibold mb-2">Top 5 Suppliers by Performance Score</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="supplier" />
          <YAxis />
          <Tooltip formatter={(val: number) => val.toFixed(1)} />
          <Bar dataKey="performance_score" fill="#3F51B5" name="Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Watchlist of High‑Risk Suppliers
const HighRiskWatchlistChart: React.FC = () => {
  const [data, setData] = useState<Array<{ supplier: string; risk_score: number }>>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/watchlist_high_risk_suppliers.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-4">
      <h3 className="text-lg font-semibold mb-2">Watchlist of High‑Risk Suppliers</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="supplier" />
          <YAxis />
          <Tooltip formatter={(val: number) => val.toFixed(2)} />
          <Bar dataKey="risk_score" fill="#E91E63" name="Risk Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Safety Incidents
const SafetyIncidentChart: React.FC = () => {
  const [data, setData] = useState<{ month: string; incidents: number }[]>([]);
  useEffect(() => {
    Papa.parse("/data/supplier_performance/safety_incidents.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);
  return (
    <div className="neu-card p-4">
      <h3 className="text-lg font-semibold mb-2">Safety Incidents</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="incidents" fill="#f44336" name="Incidents" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Supplier Risk Heatmap (3D)
const SupplierRiskHeatmapChart: React.FC = () => {
  const [data, setData] = useState<
    Array<{ supplier: string; impact: number; likelihood: number; risk_level: string; time_to_recover: number }>
  >([]);
  const COLOR_MAP: Record<string, string> = { High: "#f44336", Medium: "#ffb300", Low: "#4caf50" };

  useEffect(() => {
    Papa.parse("/data/supplier_risk.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results: any) => setData(results.data)
    });
  }, []);

  // Prepare Plotly traces grouped by risk level
  const traces = Object.entries(COLOR_MAP).map(([level, color]) => {
    const filtered = data.filter((d) => d.risk_level === level);
    return {
      x: filtered.map((d) => d.impact),
      y: filtered.map((d) => d.likelihood),
      z: filtered.map((d) => d.time_to_recover),
      text: filtered.map((d) => d.supplier),
      mode: "markers",
      type: "scatter3d" as const,
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
        title: "Impact",
        showline: true,
        linecolor: "#444",
        linewidth: 2,
        showgrid: false,
        autorange: false,
        range: [1, 5]
      },
      yaxis: {
        title: "Likelihood",
        showline: true,
        linecolor: "#444",
        linewidth: 2,
        showgrid: false,
        autorange: false,
        range: [1, 5]
      },
      zaxis: {
        title: "Time to Recover",
        showline: true,
        linecolor: "#444",
        linewidth: 2,
        showgrid: false,
        autorange: false,
        range: [0, 10]
      },
      camera: { eye: { x: 1.2, y: 1.2, z: 1.2 } }
    }
  };

  return (
    <div className="neu-card p-4 flex flex-col overflow-hidden relative" style={{ height: "300px" }}>
      <h3 className="text-lg font-semibold mb-2">Supplier Risk Heatmap</h3>
      <div className="flex-1 relative overflow-hidden">
        <Plot
          data={traces}
          layout={layout}
          config={{ responsive: true }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

// Supplier Performance Radar
const SupplierPerformanceRadarChart: React.FC = () => {
  interface Score {
    supplier: string;
    OTIF: number;
    PPM: number;
    Quality: number;
    ESG: number;
    Innovation: number;
  }
  const [rawData, setRawData] = useState<Score[]>([]);

  useEffect(() => {
    fetch("/data/supplier_scorecards.json")
      .then(res => res.json())
      .then((data: Score[]) => setRawData(data))
      .catch(console.error);
  }, []);

  const suppliers = rawData.map(d => d.supplier);
  const metrics =
    rawData.length > 0
      ? (Object.keys(rawData[0]) as Array<keyof Score>).filter(k => k !== "supplier")
      : [];

  const chartData = metrics.map(metric => {
    const entry: any = { metric };
    suppliers.forEach(supp => {
      const rec = rawData.find(d => d.supplier === supp);
      entry[supp] = rec ? rec[metric] : 0;
    });
    return entry;
  });

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#3F51B5"];

  return (
    <div className="neu-card p-4">
      <h3 className="text-lg font-semibold mb-2">Supplier Performance Radar</h3>
      {suppliers.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis />
            {suppliers.map((supp, idx) => (
              <Radar
                key={supp}
                name={supp}
                dataKey={supp}
                stroke={COLORS[idx % COLORS.length]}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                          SUPPLIER PERFORMANCE TAB                          */
/* -------------------------------------------------------------------------- */

const SupplierPerformanceTab: React.FC = () => (
  <div className="space-y-8 p-4">
    {/* Reports Section */}
    <section>
      <h2 className="text-xl font-bold mb-4">Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <OnTimeDeliveryRateChart />
        <QualityDefectRateChart />
        <SafetyIncidentChart />
      </div>
    </section>

    {/* Model Outputs Section */}
    <section>
      <h2 className="text-xl font-bold mb-4">Model Outputs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SupplierRiskScoreChart />
        <PredictedDeliveryDelaysChart />
        <SupplierRiskHeatmapChart />
        <SupplierPerformanceRadarChart />
      </div>
    </section>

    {/* Key Info Section */}
    <section>
      <h2 className="text-xl font-bold mb-4">Key Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopSuppliersPerformanceChart />
        <HighRiskWatchlistChart />
      </div>
    </section>
  </div>
);

export default SupplierPerformanceTab;
