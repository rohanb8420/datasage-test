// Central list of top suppliers for dashboard and performance metrics
export interface SupplierInfo {
  rank: number;
  name: string;
  spend: number;
  growth: number;
}

export const topSuppliers: SupplierInfo[] = [
  { rank: 1, name: 'Acme Corp', spend: 2_500_000, growth: 5 },
  { rank: 2, name: 'TechPro Solutions', spend: 2_100_000, growth: -2 },
  { rank: 3, name: 'Global Materials', spend: 1_800_000, growth: 8 },
  { rank: 4, name: 'Logistics Plus', spend: 1_500_000, growth: 1 },
  { rank: 5, name: 'Quality Parts Inc', spend: 1_200_000, growth: 3 },
  { rank: 6, name: 'SupplyCo', spend: 1_000_000, growth: 4 },
  { rank: 7, name: 'RawGoods LLC', spend: 950_000, growth: 6 },
  { rank: 8, name: 'PartsRUs', spend: 900_000, growth: -1 },
  { rank: 9, name: 'MegaManufacturing', spend: 850_000, growth: 2 },
  { rank: 10, name: 'PrimeSupplies', spend: 800_000, growth: 3 }
];

// Array of top supplier names for filtering other components
export const topSupplierNames: string[] = topSuppliers.map(s => s.name);