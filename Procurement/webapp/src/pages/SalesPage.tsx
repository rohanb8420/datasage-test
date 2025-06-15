import React from "react";
import SalesTrend from "../components/analytics/SalesTrend";
import GrowthTable from "../components/analytics/GrowthTable";
import SalesByChannelChart from "../components/analytics/SalesByChannelChart";
import TopSellers from "../components/analytics/TopSellers";
import DeliveryPerformanceChart from "../components/analytics/DeliveryPerformanceChart";
import SalesForecastChart from "../components/analytics/SalesForecastChart";
import SeasonalityHeatmap from "../components/analytics/SeasonalityHeatmap";
import PriceSensitivityAnalysis from "../components/analytics/PriceSensitivityAnalysis";

const SalesPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Sales & Forecasts</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <SalesTrend />
      <GrowthTable />
      <SalesByChannelChart />
      <TopSellers />
      <DeliveryPerformanceChart />
      <SalesForecastChart />
      <SeasonalityHeatmap />
      <PriceSensitivityAnalysis />
    </div>
  </div>
);

export default SalesPage;