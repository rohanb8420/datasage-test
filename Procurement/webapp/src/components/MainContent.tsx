import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ReportsPage from "../pages/ReportsPage";
import ERFQPage from "../pages/ERFQPage";
import VendorsPage from "../pages/VendorsPage";
import ReverseAuctionsPage from "../pages/ReverseAuctionsPage";
import AIAgentsPage from "../pages/AIAgentsPage";
import AIAssistantsPage from "../pages/AIAssistantsPage";
import AIAnalystPage from "../pages/AIAnalystPage";

const MainContent: React.FC = () => (
  <main className="flex-1 overflow-auto bg-gray-50 dark:bg-[#181818] p-6 border-l border-gray-200 dark:border-gray-800 shadow-2xl drop-shadow-2xl z-10 transition-colors duration-300">
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/erfq" element={<ERFQPage />} />
      <Route path="/vendors" element={<VendorsPage />} />
      <Route path="/reverse-auctions" element={<ReverseAuctionsPage />} />
      <Route path="/ai-agents" element={<AIAgentsPage />} />
      <Route path="/ai-assistants" element={<AIAssistantsPage />} />
      <Route path="/ai-analyst" element={<AIAnalystPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </main>
);

export default MainContent;