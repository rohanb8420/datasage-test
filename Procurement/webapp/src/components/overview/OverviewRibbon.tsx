import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface RibbonMetrics {
  totalSales: number;
  totalExpenses: number;
  netMargin: number;
  momGrowth: number;
  avgOrderValue: number;
  avgRating: number;
}

const OverviewRibbon: React.FC = () => {
  const [metrics, setMetrics] = useState<RibbonMetrics>({
    totalSales: 0,
    totalExpenses: 0,
    netMargin: 0,
    momGrowth: 0,
    avgOrderValue: 0,
    avgRating: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/data/sales_summary.csv').then((r) => r.text()),
      fetch('/data/expenses_summary.csv').then((r) => r.text()),
      fetch('/data/review_summary.csv').then((r) => r.text())
    ]).then(async ([salesText, expText, revText]) => {
      const sales = Papa.parse(salesText, { header: true, dynamicTyping: true }).data as any[];
      const exp = Papa.parse(expText, { header: true, dynamicTyping: true }).data as any[];
      const rev = Papa.parse(revText, { header: true, dynamicTyping: true }).data as any[];
      // compute latest month
      const months = Array.from(new Set(sales.map((r) => r.month))).sort();
      const latest = months[months.length - 1];
      const prev = months[months.length - 2] || latest;
      // totals
      const totalSales = sales.filter((r) => r.month === latest).reduce((sum, r) => sum + r.total_sales, 0);
      const totalExpenses = exp.filter((r) => r.month === latest).reduce((sum, r) => sum + r.total_amount, 0);
      const prevSales = sales.filter((r) => r.month === prev).reduce((sum, r) => sum + r.total_sales, 0);
      const totalOrders = sales.filter((r) => r.month === latest).reduce((sum, r) => sum + r.total_orders, 0);
      const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
      // net margin
      const netMargin = totalSales ? ((totalSales - totalExpenses) / totalSales) * 100 : 0;
      // mom growth
      const momGrowth = prevSales ? ((totalSales - prevSales) / prevSales) * 100 : 0;
      // avg rating
      const ratings = rev.filter((r) => r.month === latest).map((r) => r.avg_rating);
      const avgRating = ratings.length ? ratings[0] : 0;
      setMetrics({ totalSales, totalExpenses, netMargin, momGrowth, avgOrderValue, avgRating });
    });
  }, []);

  const items = [
    { icon: '💰', label: 'Total Sales', value: `$${metrics.totalSales.toFixed(2)}` },
    { icon: '💸', label: 'Total Expenses', value: `$${metrics.totalExpenses.toFixed(2)}` },
    { icon: '📊', label: 'Net Profit Margin', value: `${metrics.netMargin.toFixed(1)}%` },
    { icon: '📈', label: 'MoM Growth', value: `${metrics.momGrowth.toFixed(1)}%` },
    { icon: '🛒', label: 'Avg Order Value', value: `$${metrics.avgOrderValue.toFixed(2)}` },
    { icon: '⭐', label: 'Avg Rating', value: metrics.avgRating.toFixed(2) }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {items.map((item) => (
        <div key={item.label} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center space-x-4">
          <div className="text-2xl text-blue-500">{item.icon}</div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewRibbon;