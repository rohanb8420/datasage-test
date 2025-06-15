import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ChartPlaceholder from "../components/ChartPlaceholder";
import SupplierPerformanceTab from "../components/reports/SupplierPerformanceTab";
import SpendAnalyticsTab from "../components/reports/SpendAnalyticsTab";
import InventoryManagementTab from "../components/reports/InventoryManagementTab";
import ContractManagementTab from "../components/reports/ContractManagementTab";
import DemandBudgetForecastingTab from "../components/reports/DemandBudgetForecastingTab";

interface Category {
  key: string;
  label: string;
}

const categories: Category[] = [
  { key: 'supplier_performance', label: 'Supplier Performance' },
  { key: 'spend_analytics', label: 'Spend Analytics' },
  { key: 'inventory_management', label: 'Inventory Management' },
  { key: 'contract_management', label: 'Contract Management' },
  { key: 'demand_budget_forecasting', label: 'Demand & Budget Forecasting' }
];

const ReportsPage: React.FC = () => {
  const [selected, setSelected] = useState<string>(categories[0].key);
  const [dataRows, setDataRows] = useState<{ section: string; item: string }[]>([]);

  useEffect(() => {
    fetch(`/data/reports/${selected}.csv`)
      .then((r) => r.text())
      .then((text) => {
        const rows = Papa.parse(text, { header: true }).data as { section: string; item: string }[];
        setDataRows(rows);
      });
  }, [selected]);

  const reports = dataRows.filter((r) => r.section === 'Reports').map((r) => r.item);
  const modelOutputs = dataRows.filter((r) => r.section === 'Model Outputs').map((r) => r.item);
  const keyInfo = dataRows.filter((r) => r.section === 'Key Info').map((r) => r.item);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Reports & Forecasts</h1>
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-800 mb-4">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelected(c.key)}
            className={`px-4 py-2 -mb-px ${
              selected === c.key
                ? 'border-b-2 border-black text-black dark:border-white dark:text-white font-bold'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            } transition-colors duration-200`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {selected === 'supplier_performance' ? (
        <SupplierPerformanceTab />
      ) : selected === 'spend_analytics' ? (
        <SpendAnalyticsTab />
      ) : selected === 'inventory_management' ? (
        <InventoryManagementTab />
      ) : selected === 'contract_management' ? (
        <ContractManagementTab />
      ) : selected === 'demand_budget_forecasting' ? (
        <DemandBudgetForecastingTab />
      ) : (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-2">Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((r) => (
                <ChartPlaceholder key={r} title={r} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 mt-6">Model Outputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modelOutputs.map((m) => (
                <ChartPlaceholder key={m} title={m} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 mt-6">Key Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyInfo.map((k) => (
                <ChartPlaceholder key={k} title={k} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ReportsPage;