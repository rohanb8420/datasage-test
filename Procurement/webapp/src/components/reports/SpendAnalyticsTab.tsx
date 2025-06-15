import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
const Plot = createPlotlyComponent(Plotly);

// Sample spend analytics data (inline)
const topSuppliersData = [
  { supplier: "Acme Corp", spend: 120000 },
  { supplier: "Global Materials", spend: 110000 },
  { supplier: "Logistics Plus", spend: 105000 },
  { supplier: "Quality Parts Inc", spend: 95000 },
  { supplier: "TechPro Solutions", spend: 90000 }
];
const spendTrendData = [
  { month: "2025-01", spend: 100000 },
  { month: "2025-02", spend: 105000 },
  { month: "2025-03", spend: 110000 },
  { month: "2025-04", spend: 115000 },
  { month: "2025-05", spend: 120000 },
  { month: "2025-06", spend: 125000 }
];
const maverickSpendData = [
  { month: "2025-01", maverick: 5000 },
  { month: "2025-02", maverick: 6000 },
  { month: "2025-03", maverick: 7000 },
  { month: "2025-04", maverick: 8000 },
  { month: "2025-05", maverick: 9000 },
  { month: "2025-06", maverick: 10000 }
];
const budgetActualData = [
  { month: "2025-01", budget: 100000, actual: 95000 },
  { month: "2025-02", budget: 100000, actual: 105000 },
  { month: "2025-03", budget: 100000, actual: 110000 },
  { month: "2025-04", budget: 100000, actual: 112000 },
  { month: "2025-05", budget: 100000, actual: 118000 },
  { month: "2025-06", budget: 100000, actual: 125000 }
];
const shouldCostVarianceData = [
  { month: "2025-01", variance: 500 },
  { month: "2025-02", variance: -300 },
  { month: "2025-03", variance: 200 },
  { month: "2025-04", variance: -100 },
  { month: "2025-05", variance: 600 },
  { month: "2025-06", variance: 0 }
];
const spendForecast = {
  months: ["2025-07", "2025-08", "2025-09", "2025-10"],
  forecast: [130000, 135000, 140000, 145000],
  lower: [125000, 130000, 135000, 140000],
  upper: [135000, 140000, 145000, 150000]
};
const categoryForecastData = [
  { month: "2025-07", Electronics: 30000, "Raw Materials": 25000, Services: 20000, Packaging: 15000, Logistics: 10000 },
  { month: "2025-08", Electronics: 32000, "Raw Materials": 26000, Services: 21000, Packaging: 15500, Logistics: 10500 },
  { month: "2025-09", Electronics: 34000, "Raw Materials": 27000, Services: 22000, Packaging: 16000, Logistics: 11000 },
  { month: "2025-10", Electronics: 36000, "Raw Materials": 28000, Services: 23000, Packaging: 16500, Logistics: 11500 }
];
const priceVarianceData = [
  { contract: "Acme Contract", variance: 500 },
  { contract: "Global Contract", variance: -200 },
  { contract: "Logistics Contract", variance: 300 },
  { contract: "Quality Contract", variance: -100 },
  { contract: "Industrial Contract", variance: 0 }
];
const COLORS = ["#3F51B5", "#FF9800", "#4CAF50", "#9C27B0", "#2196F3"];
const SpendAnalyticsTab: React.FC = () => (
  <div className="space-y-8 p-4">
    <section>
      <h2 className="text-xl font-bold mb-4">Spend Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Suppliers */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Top Suppliers</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topSuppliersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="supplier" />
              <YAxis tickFormatter={val => `$${val/1000}k`} />
              <Tooltip formatter={val => `$${val}`} />
              <Bar dataKey="spend" fill="#3F51B5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Spend Trend */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Spend Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={spendTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={val => `$${val/1000}k`} />
              <Tooltip formatter={val => `$${val}`} />
              <Line type="monotone" dataKey="spend" stroke="#FF9800" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Maverick Spend */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Maverick Spend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={maverickSpendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={val => `$${val}`} />
              <Tooltip formatter={val => `$${val}`} />
              <Bar dataKey="maverick" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Budget vs Actual */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Budget vs Actual</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={budgetActualData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={val => `$${val/1000}k`} />
              <Tooltip formatter={val => `$${val}`} />
              <Line type="monotone" dataKey="budget" stroke="#3F51B5" />
              <Line type="monotone" dataKey="actual" stroke="#E91E63" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
    {/* Model Outputs */}
    <section>
      <h2 className="text-xl font-bold mb-4">Model Outputs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Should Cost Variance */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Should Cost Variance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={shouldCostVarianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={val => `${val}`} />
              <Line type="monotone" dataKey="variance" stroke="#9C27B0" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Spend Forecast */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Spend Forecast</h3>
          <div style={{ width: '100%', height: 200 }}>
            <Plot
              data={[
                {
                  x: spendForecast.months,
                  y: spendForecast.forecast,
                  mode: 'lines',
                  name: 'Forecast',
                  line: { color: '#FFA726' }
                },
                {
                  x: [...spendForecast.months, ...spendForecast.months.slice().reverse()],
                  y: [...spendForecast.upper, ...spendForecast.lower.slice().reverse()],
                  fill: 'toself',
                  name: 'Confidence Interval',
                  fillcolor: 'rgba(255,167,38,0.2)',
                  line: { color: 'transparent' }
                }
              ]}
              layout={{ autosize: true, margin: { l: 40, r: 40, b: 40, t: 40 } }}
              config={{ responsive: true, displayModeBar: false }}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        {/* Category Spend Forecast */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Category Spend Forecast</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={categoryForecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={val => `$${val/1000}k`} />
              <Tooltip formatter={val => `$${val}`} />
              <Legend verticalAlign="bottom" height={36} />
              {['Electronics', 'Raw Materials', 'Services', 'Packaging', 'Logistics'].map((key, idx) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Price Variance to Contract */}
        <div className="neu-card p-4">
          <h3 className="text-lg font-semibold mb-2">Price Variance to Contract</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priceVarianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="contract" />
              <YAxis />
              <Tooltip formatter={val => `${val}`} />
              <Bar dataKey="variance" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  </div>
);

export default SpendAnalyticsTab;