import React from "react";
import ExpenseBreakdownChart from "../components/analytics/ExpenseBreakdownChart";
import VendorExpenseList from "../components/analytics/VendorExpenseList";
import ExpenseMonthlyTrend from "../components/analytics/ExpenseMonthlyTrend";
import ExpenseGrowthTable from "../components/analytics/ExpenseGrowthTable";
import FixedVariableCostChart from "../components/analytics/FixedVariableCostChart";
import DeliveryPerformanceChart from "../components/analytics/DeliveryPerformanceChart";
import ExpenseForecastChart from "../components/analytics/ExpenseForecastChart";
import CostPerTransaction from "../components/analytics/CostPerTransaction";

const ExpensesPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Expenses & Costs</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ExpenseBreakdownChart />
      <VendorExpenseList />
      <ExpenseMonthlyTrend />
      <ExpenseGrowthTable />
      <FixedVariableCostChart />
      <DeliveryPerformanceChart />
      <ExpenseForecastChart />
      <CostPerTransaction />
    </div>
  </div>
);

export default ExpensesPage;