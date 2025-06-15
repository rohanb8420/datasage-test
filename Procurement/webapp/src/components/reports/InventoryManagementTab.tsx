import React from "react";
import StockLevelsTile from "./StockLevelsTile";
import InventoryTurnoverRatioTile from "./InventoryTurnoverRatioTile";
import AgingInventoryTile from "./AgingInventoryTile";

const InventoryManagementTab: React.FC = () => (
  <div className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">Inventory Management</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StockLevelsTile />
      <InventoryTurnoverRatioTile />
      <AgingInventoryTile />
    </div>
  </div>
);

export default InventoryManagementTab;