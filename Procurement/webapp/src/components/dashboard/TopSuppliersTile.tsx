import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { CheckBadgeIcon, ExclamationTriangleIcon, StarIcon } from "@heroicons/react/24/outline";

type RawSupplierData = { supplier: string; spend: number };
type SupplierData = RawSupplierData & { tag: string };

const badgeConfig: Record<string, { icon: React.ComponentType<any>; className: string }> = {
  Preferred: {
    icon: CheckBadgeIcon,
    className: "inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium"
  },
  Critical: {
    icon: ExclamationTriangleIcon,
    className: "inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-medium"
  },
  Diverse: {
    icon: StarIcon,
    className: "inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium"
  }
};

const TopSuppliersTile: React.FC = () => {
  const [data, setData] = useState<SupplierData[]>([]);

  useEffect(() => {
    async function loadData() {
      const csvData: RawSupplierData[] = await new Promise((resolve) => {
        Papa.parse("/data/top_suppliers_by_spend.csv", {
          header: true,
          download: true,
          dynamicTyping: true,
          complete: (results) => resolve(results.data as RawSupplierData[]),
        });
      });
      const scorecards: any[] = await fetch("/data/supplier_scorecards.json")
        .then(res => (res.ok ? res.json() : []))
        .catch(() => []);
      const merged: SupplierData[] = csvData.map(item => {
        const sc = scorecards.find(s => s.supplier === item.supplier);
        const otif = sc?.OTIF ?? 0;
        let tag = "Diverse";
        if (otif >= 85) tag = "Preferred";
        else if (otif < 70) tag = "Critical";
        return { ...item, tag };
      });
      setData(merged);
    }
    loadData();
  }, []);

  return (
    <div className="bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-none rounded-xl shadow-sm hover:shadow-lg hover:bg-stone-100 p-5 min-h-[22rem] flex flex-col justify-between text-slate-800 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Top Suppliers</h3>
      </div>
      <div className="h-56 overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-1">Supplier</th>
              <th className="text-left py-1">Spend</th>
              <th className="text-left py-1">Tag</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const cfg = badgeConfig[item.tag] || badgeConfig.Diverse;
              const Icon = cfg.icon;
              return (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="py-1">{item.supplier}</td>
                  <td className="py-1">{item.spend.toLocaleString()}</td>
                  <td className="py-1">
                    <span className={cfg.className}>
                      <Icon className="h-4 w-4 mr-1" />
                      {item.tag}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSuppliersTile;