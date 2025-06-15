import React from "react";
import ContractExpiryTimelineTile from "./ContractExpiryTimelineTile";
import ContractExpirationsValueTile from "./ContractExpirationsValueTile";

const ContractManagementTab: React.FC = () => (
  <div className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">Contract Management</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ContractExpiryTimelineTile />
      <ContractExpirationsValueTile />
    </div>
  </div>
);

export default ContractManagementTab;