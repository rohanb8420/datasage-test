import React from "react";

interface KpiTileProps {
  icon: React.ReactNode;
  name: string;
  value: number;
  valueFormat: "currency" | "percent";
  target: number;
  delta: number;
}

const KpiTile: React.FC<KpiTileProps> = ({
  icon,
  name,
  value,
  valueFormat,
  target,
  delta,
}) => {
  const formattedValue =
    valueFormat === "currency"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      : `${value}%`;

  const formattedTarget =
    valueFormat === "currency"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(target)
      : `${target}%`;

  const progress = target > 0 ? (value / target) * 100 : 0;
  const progressWidth = Math.min(Math.max(progress, 0), 100);
  const progressColor = progress >= 100 ? "bg-red-500" : "bg-green-500";
  const deltaColor = delta >= 0 ? "text-green-500" : "text-red-500";
  const deltaSign = delta > 0 ? "+" : "";

  return (
    <div className="bg-[#F1F5F9] dark:bg-[#161E2E] rounded-xl shadow-sm p-3 w-64 h-32 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1 text-sm font-semibold text-gray-900 dark:text-white">
          <span>{icon}</span>
          <span>{name}</span>
        </div>
        <div className={`text-sm font-semibold ${deltaColor}`}>{`${deltaSign}${delta}%`}</div>
      </div>
      <div className="mt-1 text-2xl font-bold leading-tight text-gray-900 dark:text-white">{formattedValue}</div>
      <div className="mt-1 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${progressColor} h-1.5 rounded-full`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      <div className="mt-1 text-xs leading-tight text-gray-600 dark:text-gray-400">Target: {formattedTarget}</div>
    </div>
  );
};

export default KpiTile;