"use strict";
const fs = require("fs");
const path = require("path");

// Helpers
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 2) => {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
};

// Generate list of months from start (YYYY-MM) for count months
function generateMonths(start, count) {
  let [year, month] = start.split("-").map(Number);
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(`${year}-${String(month).padStart(2, '0')}`);
    month++;
    if (month > 12) { month = 1; year++; }
  }
  return list;
}

// Prepare directory
const forecastDir = path.join(__dirname, "../public/data/demand_budget_forecasting");
fs.mkdirSync(forecastDir, { recursive: true });

const months = generateMonths("2023-01", 36);
const projects = ["Project A", "Project B", "Project C", "Project D"];

// budget_vs_actual_by_project.csv
const lines1 = ["Month,Project_ID,Budget,Actual_Spend"];
months.forEach((mo) => {
  projects.forEach((proj) => {
    const bud = randomInt(80000, 150000);
    const act = randomInt(Math.floor(bud * 0.8), Math.ceil(bud * 1.2));
    lines1.push(`${mo}-01,${proj},${bud},${act}`);
  });
});
fs.writeFileSync(
  path.join(forecastDir, "budget_vs_actual_by_project.csv"),
  lines1.join("\n"),
  "utf8"
);

// forecast_vs_actual_spend.csv
const lines2 = ["Month,Forecast,Actual"];
months.forEach((mo) => {
  const fc = randomInt(80000, 150000);
  const ac = randomInt(60000, 160000);
  lines2.push(`${mo},${fc},${ac}`);
});
fs.writeFileSync(
  path.join(forecastDir, "forecast_vs_actual_spend.csv"),
  lines2.join("\n"),
  "utf8"
);

// forecast_eoy.csv
const lines3 = ["Fiscal_Year,Forecast_EOY,Budget"];
for (let fy = 2023; fy <= 2024; fy++) {
  const fval = randomInt(1000000, 5000000);
  const bval = randomInt(Math.floor(fval * 0.9), Math.ceil(fval * 1.1));
  lines3.push(`${fy}-${fy + 1},${fval},${bval}`);
}
fs.writeFileSync(
  path.join(forecastDir, "forecast_eoy.csv"),
  lines3.join("\n"),
  "utf8"
);

// seasonal_patterns.csv (static)
const seasonal = [
  "Month,Value",
  "Jan,120","Feb,100","Mar,90","Apr,80",
  "May,110","Jun,130","Jul,140","Aug,150",
  "Sep,120","Oct,100","Nov,95","Dec,115"
];
fs.writeFileSync(
  path.join(forecastDir, "seasonal_patterns.csv"),
  seasonal.join("\n"),
  "utf8"
);

// contract_compliance.csv (static)
const compliance = ["Category,Value","On Contract,60","Off Contract,30","Overrun,10"];
fs.writeFileSync(
  path.join(forecastDir, "contract_compliance.csv"),
  compliance.join("\n"),
  "utf8"
);

// budget_variance_alerts.csv (static)
const bva = [
  "Project_ID,Variance_Percent",
  "Project A,5","Project B,-3","Project C,10","Project D,-5",
  "Project E,2","Project F,-8","Project G,12","Project H,-1"
];
fs.writeFileSync(
  path.join(forecastDir, "budget_variance_alerts.csv"),
  bva.join("\n"),
  "utf8"
);

// top_drivers_of_overrun.csv (static)
const drivers = [
  "Driver,Impact",
  "Scope Creep,30","Poor Planning,25","Material Price Increase,20",
  "Labor Overtime,15","Design Changes,10"
];
fs.writeFileSync(
  path.join(forecastDir, "top_drivers_of_overrun.csv"),
  drivers.join("\n"),
  "utf8"
);

// budget_allocation_by_category.csv
{
  const bac = ["Category,Budget"];
  const categories = ["Food", "Beverage", "Labor", "Utilities", "Marketing", "Maintenance"];
  categories.forEach((cat) => {
    const val = randomInt(500000, 4000000);
    bac.push(`${cat},${val}`);
  });
  fs.writeFileSync(
    path.join(forecastDir, "budget_allocation_by_category.csv"),
    bac.join("\n"),
    "utf8"
  );
}

// budget_utilization_vs_plan.csv
const util = ["Month,Planned_Spend,Actual_Spend"];
months.forEach((mo) => {
  const bud = randomInt(80000, 150000);
  const act = randomInt(Math.floor(bud * 0.8), Math.ceil(bud * 1.2));
  util.push(`${mo},${bud},${act}`);
});
fs.writeFileSync(
  path.join(forecastDir, "budget_utilization_vs_plan.csv"),
  util.join("\n"),
  "utf8"
);

console.log(
  `Generated Demand & Budget Forecasting sample data (2023-2025) in ${forecastDir}`
);