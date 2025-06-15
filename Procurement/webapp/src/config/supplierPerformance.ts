import { topSupplierNames } from './topSuppliers';

// Supplier performance scorecard interface
export interface SupplierScorecard {
  supplier: string;
  OTIF: number;      // On-Time In-Full %
  PPM: number;       // Parts Per Million defects
  Quality: number;   // Quality score
  ESG: number;       // ESG rating
  Innovation: number;// Innovation index
}

// Generate placeholder supplier performance data based on top suppliers
export const supplierScorecards: SupplierScorecard[] =
  topSupplierNames.map((name, idx) => ({
    supplier: name,
    // Example metric values; adjust as needed
    OTIF: 90 - idx * 2,
    PPM: 100 + idx * 5,
    Quality: 80 + (idx % 3) * 5,
    ESG: 70 + (idx % 4) * 3,
    Innovation: 60 + (idx % 5) * 4,
  }));