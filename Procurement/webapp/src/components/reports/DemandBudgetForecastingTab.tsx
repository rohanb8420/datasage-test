import React from "react";
import SeasonalPatternsTile from "./SeasonalPatternsTile";
import BudgetUtilizationVsPlanTile from "./BudgetUtilizationVsPlanTile";
import ForecastVsActualSpendTile from "./ForecastVsActualSpendTile";
import EOYForecastGaugeTile from "./EOYForecastGaugeTile";
import BudgetVsActualByProjectTile from "./BudgetVsActualByProjectTile";
import BudgetAllocationDonutTile from "./BudgetAllocationDonutTile";
import ContractCompliancePieTile from "./ContractCompliancePieTile";
import CumulativePlanVsActualTile from "./CumulativePlanVsActualTile";
import BudgetVarianceAlertsTile from "./BudgetVarianceAlertsTile";
import TopDriversOfOverrunTile from "./TopDriversOfOverrunTile";
import BudgetAllocationCategoryPieTile from "./BudgetAllocationCategoryPieTile";


const DemandBudgetForecastingTab: React.FC = () => (
  <div className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">Demand & Budget Forecasting</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SeasonalPatternsTile />
      <BudgetUtilizationVsPlanTile />
      <ForecastVsActualSpendTile />
      <EOYForecastGaugeTile />
      <BudgetAllocationCategoryPieTile />
      <BudgetVsActualByProjectTile />
      <BudgetAllocationDonutTile />
      <ContractCompliancePieTile />
      <CumulativePlanVsActualTile />
      <BudgetVarianceAlertsTile />
      <TopDriversOfOverrunTile />
    </div>
  </div>
);

export default DemandBudgetForecastingTab;