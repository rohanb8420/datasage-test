"use strict";
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../public/data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helpers
const pad = (n) => n.toString().padStart(2, '0');
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 2) => {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
};

// Generate date strings
const generateDates = (start, count) => {
  const dates = [];
  let d = new Date(start);
  for (let i = 0; i < count; i++) {
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    dates.push(`${d.getFullYear()}-${month}-${day}`);
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

// Raw Sales
(() => {
  const channels = ["dine_in", "takeout", "delivery"];
  const dates = generateDates('2025-01-01', 50);
  const lines = [
    'date,store_id,channel,item_id,quantity,unit_price,total_sales'
  ];
  for (let i = 0; i < 50; i++) {
    const date = dates[i];
    const store_id = (i % 5) + 1;
    const channel = channels[i % channels.length];
    const item_id = 101 + (i % 10);
    const quantity = randomInt(1, 10);
    const unit_price = randomFloat(5, 50);
    const total_sales = parseFloat((quantity * unit_price).toFixed(2));
    lines.push([date, store_id, channel, item_id, quantity, unit_price, total_sales].join(','));
  }
  fs.writeFileSync(path.join(dataDir, 'raw_sales.csv'), lines.join('\n'));
})();
// Vendor Monthly Spend Summary for Expenses tab
(function() {
  const vendors = ['Vendor A','Vendor B','Vendor C','Vendor D'];
  const months = ['2025-01','2025-02','2025-03'];
  const lines = ['month,vendor,total_spend'];
  months.forEach((m) => {
    vendors.forEach((v) => {
      const amt = randomFloat(1000, 20000);
      lines.push([m, v, amt.toFixed(2)].join(','));
    });
  });
  fs.writeFileSync(path.join(dataDir, 'vendor_monthly_spend.csv'), lines.join('\n'));
})();

// Raw Inventory
(() => {
  const dates = generateDates('2025-01-01', 50);
  const lines = ['date,item_id,beginning_stock,received,sold,ending_stock'];
  for (let i = 0; i < 50; i++) {
    const date = dates[i];
    const item_id = 101 + (i % 10);
    const beginning_stock = randomInt(50, 200);
    const received = randomInt(0, 100);
    const sold = randomInt(0, beginning_stock + received);
    const ending_stock = beginning_stock + received - sold;
    lines.push([date, item_id, beginning_stock, received, sold, ending_stock].join(','));
  }
  fs.writeFileSync(path.join(dataDir, 'raw_inventory.csv'), lines.join('\n'));
})();

// Raw Expenses
(() => {
  const categories = ['food', 'labor', 'utilities', 'marketing', 'rent', 'maintenance'];
  const vendors = ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'];
  const dates = generateDates('2025-01-01', 50);
  const lines = ['date,category,vendor,amount'];
  for (let i = 0; i < 50; i++) {
    const date = dates[i];
    const category = categories[i % categories.length];
    const vendor = vendors[i % vendors.length];
    const amount = randomFloat(100, 5000);
    lines.push([date, category, vendor, amount].join(','));
  }
  fs.writeFileSync(path.join(dataDir, 'raw_expenses.csv'), lines.join('\n'));
})();

// Raw Staffing
(() => {
  const roles = ['chef', 'server', 'manager', 'bartender'];
  const shifts = ['morning', 'afternoon', 'evening'];
  const dates = generateDates('2025-01-01', 50);
  const lines = ['date,employee_id,role,shift,hours_worked'];
  for (let i = 0; i < 50; i++) {
    const date = dates[i];
    const employee_id = 1000 + (i % 20);
    const role = roles[i % roles.length];
    const shift = shifts[i % shifts.length];
    const hours_worked = randomFloat(4, 12, 1);
    lines.push([date, employee_id, role, shift, hours_worked].join(','));
  }
  fs.writeFileSync(path.join(dataDir, 'raw_staffing.csv'), lines.join('\n'));
})();

// Raw Marketing
(() => {
  const campaigns = ['NewYearPromo', 'SummerSale', 'HolidayDiscount'];
  const dates = generateDates('2025-01-01', 50);
  const lines = ['date,campaign,spend,impressions,clicks,revenue_attributed'];
  for (let i = 0; i < 50; i++) {
    const date = dates[i];
    const campaign = campaigns[i % campaigns.length];
    const spend = randomFloat(100, 2000);
    const impressions = randomInt(1000, 50000);
    const clicks = randomInt(100, impressions);
    const revenue_attributed = randomFloat(500, 10000);
    lines.push([date, campaign, spend, impressions, clicks, revenue_attributed].join(','));
  }
  fs.writeFileSync(path.join(dataDir, 'raw_marketing.csv'), lines.join('\n'));
})();

// Summary Generators: last 12 months
const months = (() => {
  const arr = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    arr.push(`${d.getFullYear()}-${m}`);
  }
  return arr;
})();

// Sales Summary
(() => {
  const channels = ['dine_in', 'takeout', 'delivery'];
  const lines = ['month,store_id,channel,total_sales,total_orders'];
  months.forEach((m) => {
    for (let s = 1; s <= 3; s++) {
      channels.forEach((ch) => {
        const total_sales = randomFloat(20000, 100000);
        const total_orders = randomInt(500, 2000);
        lines.push([m, s, ch, total_sales, total_orders].join(','));
      });
    }
  });
  fs.writeFileSync(path.join(dataDir, 'sales_summary.csv'), lines.join('\n'));
})();

// Expenses Summary
(() => {
  const categories = ['food', 'labor', 'utilities', 'marketing', 'rent'];
  const lines = ['month,category,total_amount'];
  months.forEach((m) => {
    categories.forEach((cat) => {
      const total_amount = randomFloat(5000, 30000);
      lines.push([m, cat, total_amount].join(','));
    });
  });
  fs.writeFileSync(path.join(dataDir, 'expenses_summary.csv'), lines.join('\n'));
})();

// Inventory Summary
(() => {
  const lines = ['month,item_id,avg_stock_level,stock_turnover_rate'];
  months.forEach((m) => {
    for (let item = 101; item <= 105; item++) {
      const avg_stock = randomFloat(50, 200);
      const turnover = randomFloat(1, 5);
      lines.push([m, item, avg_stock, turnover].join(','));
    }
  });
  fs.writeFileSync(path.join(dataDir, 'inventory_summary.csv'), lines.join('\n'));
})();

// Staffing Summary
(() => {
  const roles = ['chef', 'server', 'manager'];
  const lines = ['month,role,total_hours,avg_hours_per_shift'];
  months.forEach((m) => {
    roles.forEach((r) => {
      const total_hours = randomFloat(200, 800);
      const avg_per_shift = randomFloat(4, 8);
      lines.push([m, r, total_hours, avg_per_shift].join(','));
    });
  });
  fs.writeFileSync(path.join(dataDir, 'staffing_summary.csv'), lines.join('\n'));
})();

// Marketing Summary
(() => {
  const campaigns = ['NewYearPromo', 'SummerSale', 'HolidayDiscount'];
  const lines = ['month,campaign,total_spend,total_clicks,click_through_rate,revenue_attributed'];
  months.forEach((m) => {
    campaigns.forEach((c) => {
      const spend = randomFloat(2000, 15000);
      const clicks = randomInt(1000, 10000);
      const impressions = randomInt(10000, 100000);
      const ctr = parseFloat((clicks / impressions).toFixed(4));
      const revenue = randomFloat(5000, 30000);
      lines.push([m, c, spend, clicks, ctr, revenue].join(','));
    });
  });
  fs.writeFileSync(path.join(dataDir, 'marketing_summary.csv'), lines.join('\n'));
})();
// Raw Reviews (daily ratings for past 365 days)
(() => {
  const start = new Date();
  start.setDate(start.getDate() - 364);
  const lines = ['date,rating'];
  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const dateStr = `${d.getFullYear()}-${month}-${day}`;
    const rating = randomFloat(3, 5, 2);
    lines.push(`${dateStr},${rating}`);
  }
  fs.writeFileSync(path.join(dataDir, 'raw_reviews.csv'), lines.join('\n'));
})();
// Review Summary (average monthly rating)
(() => {
  const lines = ['month,avg_rating'];
  const map = {};
  const counts = {};
  fs.readFileSync(path.join(dataDir, 'raw_reviews.csv'), 'utf8')
    .split('\n').slice(1)
    .forEach((line) => {
      if (!line) return;
      const [date, rating] = line.split(',');
      const m = date.slice(0,7);
      map[m] = (map[m] || 0) + parseFloat(rating);
      counts[m] = (counts[m] || 0) + 1;
    });
  Object.keys(map).sort().forEach((m) => {
    const avg = parseFloat((map[m] / counts[m]).toFixed(2));
    lines.push(`${m},${avg}`);
  });
  fs.writeFileSync(path.join(dataDir, 'review_summary.csv'), lines.join('\n'));
})();
// Inventory Days on Hand Summary
(() => {
  const lines = ['month,days_on_hand'];
  months.forEach((m) => {
    const doh = randomFloat(20, 60, 1);
    lines.push(`${m},${doh}`);
  });
  fs.writeFileSync(path.join(dataDir, 'inventory_days_on_hand.csv'), lines.join('\n'));
})();
// Demand & Budget Forecasting Sample Data
(function() {
  const forecastDir = path.join(__dirname, "../public/data/demand_budget_forecasting");
  fs.mkdirSync(forecastDir, { recursive: true });

  const generateMonthList = (start, count) => {
    const result = [];
    let [year, month] = start.split("-").map(Number);
    for (let i = 0; i < count; i++) {
      result.push(`${year}-${String(month).padStart(2, '0')}`);
      month++;
      if (month > 12) { month = 1; year++; }
    }
    return result;
  };
  const monthsList = generateMonthList("2023-01", 36);
  const projects = ["Project A", "Project B", "Project C", "Project D"];

  // budget_vs_actual_by_project.csv
  const bvap = ["Month,Project_ID,Budget,Actual_Spend"];
  monthsList.forEach((mo) => {
    projects.forEach((proj) => {
      const bud = randomInt(80000, 150000);
      const act = randomInt(Math.floor(bud * 0.8), Math.ceil(bud * 1.2));
      bvap.push(`${mo}-01,${proj},${bud},${act}`);
    });
  });
  fs.writeFileSync(path.join(forecastDir, "budget_vs_actual_by_project.csv"), bvap.join("\n"));

  // forecast_vs_actual_spend.csv
  const fvas = ["Month,Forecast,Actual"];
  monthsList.forEach((mo) => {
    const fc = randomInt(80000, 150000);
    const ac = randomInt(60000, 160000);
    fvas.push(`${mo},${fc},${ac}`);
  });
  fs.writeFileSync(path.join(forecastDir, "forecast_vs_actual_spend.csv"), fvas.join("\n"));

  // forecast_eoy.csv
  const feoy = ["Fiscal_Year,Forecast_EOY,Budget"];
  [2023, 2024].forEach((fy) => {
    const fval = randomInt(1000000, 5000000);
    const bval = randomInt(Math.floor(fval * 0.9), Math.ceil(fval * 1.1));
    feoy.push(`${fy}-${fy + 1},${fval},${bval}`);
  });
  fs.writeFileSync(path.join(forecastDir, "forecast_eoy.csv"), feoy.join("\n"));

  // seasonal_patterns.csv (static month names)
  const seasonal = [
    "Month,Value",
    "Jan,120", "Feb,100", "Mar,90", "Apr,80",
    "May,110", "Jun,130", "Jul,140", "Aug,150",
    "Sep,120", "Oct,100", "Nov,95", "Dec,115"
  ];
  fs.writeFileSync(path.join(forecastDir, "seasonal_patterns.csv"), seasonal.join("\n"));

  // contract_compliance.csv (static)
  const compliance = [
    "Category,Value",
    "On Contract,60", "Off Contract,30", "Overrun,10"
  ];
  fs.writeFileSync(path.join(forecastDir, "contract_compliance.csv"), compliance.join("\n"));

  // budget_variance_alerts.csv (static)
  const bva = [
    "Project_ID,Variance_Percent",
    "Project A,5", "Project B,-3", "Project C,10", "Project D,-5",
    "Project E,2", "Project F,-8", "Project G,12", "Project H,-1"
  ];
  fs.writeFileSync(path.join(forecastDir, "budget_variance_alerts.csv"), bva.join("\n"));

  // top_drivers_of_overrun.csv (static)
  const drivers = [
    "Driver,Impact",
    "Scope Creep,30", "Poor Planning,25", "Material Price Increase,20",
    "Labor Overtime,15", "Design Changes,10"
  ];
  fs.writeFileSync(path.join(forecastDir, "top_drivers_of_overrun.csv"), drivers.join("\n"));
})();
// Labor Efficiency Summary
(() => {
  const lines = ['month,total_hours,total_sales'];
  months.forEach((m) => {
    const hours = randomFloat(200, 800, 1);
    const sales = randomFloat(20000, 100000, 2);
    lines.push(`${m},${hours},${sales}`);
  });
  fs.writeFileSync(path.join(dataDir, 'labor_efficiency.csv'), lines.join('\n'));
})();
// Expense Anomalies Summary (count per month)
(() => {
  const lines = ['month,anomaly_count'];
  months.forEach((m) => {
    const count = randomInt(0, 5);
    lines.push(`${m},${count}`);
  });
  fs.writeFileSync(path.join(dataDir, 'anomalies_summary.csv'), lines.join('\n'));
})();