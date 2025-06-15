import React, { useState, useEffect } from "react";
// removed direct OpenAI SDK import; using backend chat proxy instead
import Papa from "papaparse";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
const Plot = createPlotlyComponent(Plotly);

interface ChartSpec {
  chartType: string;
  chartType2?: string;
  dataFile: string;
  xField: string;
  yField: string;
  yField2?: string;
  secondaryYAxis?: boolean;
  title?: string;
}
// Component to fetch data and render the chart
const ChartRenderer: React.FC<{ spec: ChartSpec }> = ({ spec }) => {
  const [data, setData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    // Load aggregated data via API
    const loadUrl = `/api/pulse/data/${spec.dataFile}`;
    fetch(loadUrl)
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data as any[]);
            setLoadingData(false);
          }
        });
      })
      .catch(err => {
        console.error("Error loading data file", spec.dataFile, err);
        setLoadingData(false);
      });
  }, [spec.dataFile]);

  if (loadingData) {
    return <div>Loading data...</div>;
  }
  // Prepare multi-series traces
  const xValues = data.map(d => d[spec.xField]);
  const yValues1 = data.map(d => d[spec.yField]);
  const traces: any[] = [
    { x: xValues, y: yValues1, type: spec.chartType as any, name: spec.title || spec.yField }
  ];
  if (spec.yField2) {
    const yValues2 = data.map(d => d[spec.yField2!]);
    traces.push({
      x: xValues,
      y: yValues2,
      type: (spec.chartType2 as any) || (spec.chartType as any),
      name: spec.yField2!,
      yaxis: spec.secondaryYAxis ? 'y2' : 'y'
    });
  }
  // Build layout with optional secondary Y-axis
  const layout: any = {
    autosize: true,
    title: spec.title,
    margin: { l: 40, r: 40, b: 40, t: 40 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    yaxis: { title: spec.yField }
  };
  if (spec.secondaryYAxis && spec.yField2) {
    layout.yaxis2 = { title: spec.yField2, overlaying: 'y', side: 'right' };
  }
  return (
    <Plot
      data={traces}
      layout={layout}
      config={{ responsive: true }}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
    />
  );
};

const AIAnalystPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [assistantReply, setAssistantReply] = useState<string>("");
  const [charts, setCharts] = useState<ChartSpec[]>([]);
  const [components, setComponents] = useState<{ componentName: string; relativePath: string }[]>([]);

  const runAnalysis = async () => {
    setLoading(true);
    setAssistantReply("");
    try {
      // Send request to backend Pulse API
      const res = await fetch("/api/pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setAssistantReply(`Error: ${(err && err.error) || res.statusText}`);
        return;
      }
      const json = await res.json();
      if (json.name === "create_chart" && json.arguments) {
        const args = json.arguments as ChartSpec;
        setCharts(prev => [...prev, args]);
        setAssistantReply("");
      } else if (json.name === "create_component" && json.arguments) {
        const { componentName, relativePath } = json.arguments;
        setComponents(prev => [...prev, { componentName, relativePath }]);
        setAssistantReply("");
      } else if (json.reply) {
        setAssistantReply(json.reply);
      } else {
        setAssistantReply(JSON.stringify(json));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Analyst (Beta)</h1>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask me to create a chart..."
      />
      <button
        type="button"
        onClick={runAnalysis}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Running..." : "Run"}
      </button>
      {assistantReply && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded whitespace-pre-wrap">
          {assistantReply}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.map((c, i) => (
          <div key={i} className="neu-card p-4 h-96">
            <h3 className="text-lg font-semibold mb-2">{c.title || c.dataFile}</h3>
            <ChartRenderer spec={c} />
          </div>
        ))}
      </div>
      {components.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Generated Components</h2>
          <ul className="list-disc pl-5">
            {components.map((c, i) => (
              <li key={i}>
                {c.componentName}: <code>{c.relativePath}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAnalystPage;