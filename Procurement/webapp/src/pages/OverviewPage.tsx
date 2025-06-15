import React from "react";
import OverviewRibbon from "../components/overview/OverviewRibbon";
import RevenueExpensesChart from "../components/overview/RevenueExpensesChart";
import GrowthComparisonChart from "../components/overview/GrowthComparisonChart";
import SalesChannelOverviewChart from "../components/overview/SalesChannelOverviewChart";
import TopMenuItemsChart from "../components/overview/TopMenuItemsChart";
import ExpenseBreakdownChart from "../components/analytics/ExpenseBreakdownChart";
import InventoryDOHChart from "../components/overview/InventoryDOHChart";
import LaborEfficiencyChart from "../components/overview/LaborEfficiencyChart";
import AnomalyAlertsOverview from "../components/overview/AnomalyAlertsOverview";
import ReviewSentimentTrend from "../components/overview/ReviewSentimentTrend";

const OverviewPage: React.FC = () => (
  <div className="p-6">
    <OverviewRibbon />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <RevenueExpensesChart />
      <GrowthComparisonChart />
      <SalesChannelOverviewChart />
      <TopMenuItemsChart />
      <ExpenseBreakdownChart />
      <InventoryDOHChart />
      <LaborEfficiencyChart />
      <AnomalyAlertsOverview />
      <ReviewSentimentTrend />
    </div>
  </div>
);

export default OverviewPage;