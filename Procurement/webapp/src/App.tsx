import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Sidebar from "./components/Sidebar";
import TopPanel from "./components/TopPanel";
import MainContent from "./components/MainContent";
import ChatWidget from "./components/ChatWidget";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const handleSplashFinish = () => setShowSplash(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  return (
    <BrowserRouter>
      <div className={darkMode ? "dark" : ""}>
        <div className="flex flex-col h-screen transition-colors duration-300 text-gray-900 dark:text-white">
          <TopPanel
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            toggleSidebar={toggleSidebar}
          />
          <div className="flex flex-1 overflow-hidden relative">
            {/* Mobile overlay for sidebar */}
            <div
              className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden`}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar drawer */}
            <div
              className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative inset-y-0 left-0 z-20 transition-transform duration-300`}
            >
              <Sidebar />
            </div>
            {/* Main content area */}
            <div className="flex-1 overflow-auto">
              <MainContent />
            </div>
          </div>
          {/* Chat assistant widget */}
          <ChatWidget />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;