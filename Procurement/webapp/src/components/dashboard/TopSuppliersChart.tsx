import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface SupplierData {
  supplier: string;
  spend: number;
}

const TopSuppliersChart: React.FC = () => {
  const [data, setData] = useState<SupplierData[]>([]);

  useEffect(() => {
    Papa.parse("/data/top_suppliers_by_spend.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        setData(results.data as SupplierData[]);
      }
    });
  }, []);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <div className="h-full overflow-auto">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, index) => (
          <li key={index} className="flex justify-between items-center py-2">
            <span className="text-gray-800 dark:text-gray-100">{item.supplier}</span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {formatter.format(item.spend)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSuppliersChart;