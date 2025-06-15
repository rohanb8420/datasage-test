import React from "react";
import { HomeIcon, ChartBarIcon, ClipboardDocumentListIcon, UsersIcon, PresentationChartLineIcon, CpuChipIcon, ChatBubbleLeftEllipsisIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";

export interface SidebarItem {
  name: string;
  path?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Reports & Forecasts", path: "/reports", icon: ChartBarIcon },
  {
    name: "Sourcing",
    icon: ClipboardDocumentListIcon,
    children: [
      { name: "eRFQ", path: "/erfq", icon: ClipboardDocumentListIcon },
      { name: "Vendors", path: "/vendors", icon: UsersIcon },
      { name: "Reverse Auctions", path: "/reverse-auctions", icon: PresentationChartLineIcon },
    ],
  },
  {
    name: "AI Agents",
    icon: CpuChipIcon,
    children: [
      { name: "Agents", path: "/ai-agents", icon: CpuChipIcon },
    ],
  },
  {
    name: "AI Assistants",
    icon: ChatBubbleLeftEllipsisIcon,
    children: [
      { name: "Sage", path: "/ai-assistants", icon: ChatBubbleLeftEllipsisIcon },
    ],
  },
  { name: "Pulse",            path: "/ai-analyst", icon: ChartBarSquareIcon }
];