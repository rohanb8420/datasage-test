import React from "react";
import { ExclamationTriangleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface AlertTileProps {
  severity: "warning" | "critical" | "moderate" | "positive";
  title: string;
  description: string;
}

const AlertTile: React.FC<AlertTileProps> = ({ severity, title, description }) => {
  const bgClasses =
    severity === "critical"
      ? "bg-[#FEE2E2] dark:bg-[#3B1F1F] border-l-4 border-red-600"
      : severity === "warning" || severity === "moderate"
      ? "bg-[#FFF7ED] dark:bg-[#3B2C1E] border-l-4 border-yellow-600"
      : "bg-[#e8f5e9]";
  const textColorClass = "text-gray-900 dark:text-white";
  const Icon = severity === "critical" ? ExclamationCircleIcon : ExclamationTriangleIcon;

  return (
    <div className={`${bgClasses} rounded-xl shadow-sm p-3 w-64 h-28 flex flex-col justify-center items-start`}>
      {/* Title row with icon */}
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${textColorClass}`} />
        <span className={`${textColorClass} font-bold text-sm leading-tight`}>{title}</span>
      </div>
      {/* Description row below (styled like KPI target text) */}
      <div className="mt-1 text-xs leading-tight text-gray-600 dark:text-gray-400">
        {description}
      </div>
    </div>
  );
};

export default AlertTile;