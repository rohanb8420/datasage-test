import React from "react";
import TopSuppliersLeaderboardTile from "../components/dashboard/TopSuppliersLeaderboardTile";
import SpendTrendTile from "../components/dashboard/SpendTrendTile";
import TopSpendCategoriesTile from "../components/dashboard/TopSpendCategoriesTile";
import SupplierPerformanceRadarTile from "../components/dashboard/SupplierPerformanceRadarTile";
import SupplierRiskHeatmapTile from "../components/dashboard/SupplierRiskHeatmapTile";
import SavingsRealisedVsNegotiatedTile from "../components/dashboard/SavingsRealisedVsNegotiatedTile";
import SourcingPipelineStatusTile from "../components/dashboard/SourcingPipelineStatusTile";
import ContractExpirationsCalendarTile from "../components/dashboard/ContractExpirationsCalendarTile";
import MaverickSpendMonitorTile from "../components/dashboard/MaverickSpendMonitorTile";
import ShouldCostVarianceTile from "../components/dashboard/ShouldCostVarianceTile";
import NegotiationEffectivenessTile from "../components/dashboard/NegotiationEffectivenessTile";
import CommodityPriceOutlookTile from "../components/dashboard/CommodityPriceOutlookTile";
import OpportunitySavingsFunnelTile from "../components/dashboard/OpportunitySavingsFunnelTile";
import BudgetAllocationPieTile from "../components/dashboard/BudgetAllocationPieTile";
import BudgetVarianceAlertsTile from "../components/dashboard/BudgetVarianceAlertsTile";
import KpiTile from "../components/dashboard/KpiTile";
import AlertTile from "../components/dashboard/AlertTile";


const Dashboard: React.FC = () => (
  <div className="px-6 pt-4 pb-8">
    {/* KPI & Alerts Row */}
    <div className="flex flex-nowrap gap-3 overflow-x-auto mb-4">
      <KpiTile icon="💲" name="Total Spend" value={12500000} valueFormat="currency" target={15000000} delta={8} />
      <KpiTile icon="🎯" name="Cost Savings" value={3200000} valueFormat="currency" target={5000000} delta={15} />
      <KpiTile icon="✅" name="Contract Compliance" value={87} valueFormat="percent" target={90} delta={2} />
      <KpiTile icon="⚠️" name="Maverick Spend" value={6.5} valueFormat="percent" target={5} delta={-1} />
      <AlertTile severity="warning" title="Contracts Expiring Soon" description="2 contracts expiring in 7 days" />
      <AlertTile severity="critical" title="Supplier X on Watchlist" description="Quality Parts Inc on Watchlist" />
    </div>
    {/* Strategic Procurement Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <TopSuppliersLeaderboardTile />
        <SpendTrendTile />
        <TopSpendCategoriesTile />
        <SupplierPerformanceRadarTile />
        <SupplierRiskHeatmapTile />
        <SavingsRealisedVsNegotiatedTile />
        <SourcingPipelineStatusTile />
        <ContractExpirationsCalendarTile />
        <BudgetAllocationPieTile />
        <BudgetVarianceAlertsTile />
        <MaverickSpendMonitorTile />
        <ShouldCostVarianceTile />
        <NegotiationEffectivenessTile />
        <CommodityPriceOutlookTile />
        <OpportunitySavingsFunnelTile />
      </div>
  </div>
);
export default Dashboard;