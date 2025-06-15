import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { sidebarItems } from '../config/sidebarItems';
import { alerts } from '../config/alerts';
import { Bars3Icon, SunIcon, MoonIcon, BellIcon, PlusCircleIcon, BanknotesIcon, UserPlusIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
// Props for theme toggle
interface TopPanelProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

const TopPanel: React.FC<TopPanelProps> = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  // derive page title from sidebar config
  const getTitle = () => {
    const { pathname } = location;
    const direct = sidebarItems.find(item => item.path === pathname);
    if (direct) return direct.name;
    for (const item of sidebarItems) {
      if (item.children) {
        const child = item.children.find(c => c.path === pathname);
        if (child) return child.name;
      }
    }
    return '';
  };
  const title = getTitle();

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className="relative flex justify-between items-center pl-6 pr-6 py-3 md:pl-64 bg-gray-100 text-gray-900 transition-colors duration-150 hover:bg-gray-200 sticky top-0 z-10 dark:bg-[#0A0A0A] dark:text-white dark:hover:bg-gray-900">
        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center h-10 px-4 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none z-30">
          <span className="text-sm dark:text-white">Rohan Bhowmik</span>
        </button>
        <div className="flex items-center">
        {/* Mobile sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="text-2xl md:hidden focus:outline-none mr-4"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6 text-gray-900 dark:text-white" />
          </button>
          {/* Module title */}
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
        </div>
        <div className="flex items-center space-x-4">
        {/* Top Quick Action Icons */}
        <NavLink to="/erfq" title="New RFQ" className="text-xl hover:text-gray-900 dark:hover:text-white transition-colors">
          <PlusCircleIcon className="h-6 w-6 text-gray-900 dark:text-white" />
        </NavLink>
        <NavLink to="/reverse-auctions" title="Create Auction" className="text-xl hover:text-gray-900 dark:hover:text-white transition-colors">
          <BanknotesIcon className="h-6 w-6 text-gray-900 dark:text-white" />
        </NavLink>
        <NavLink to="/vendors" title="Add Vendor" className="text-xl hover:text-gray-900 dark:hover:text-white transition-colors">
          <UserPlusIcon className="h-6 w-6 text-gray-900 dark:text-white" />
        </NavLink>
        <NavLink to="/reports" title="Run Forecast" className="text-xl hover:text-gray-900 dark:hover:text-white transition-colors">
          <ChartBarSquareIcon className="h-6 w-6 text-gray-900 dark:text-white" />
        </NavLink>
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="focus:outline-none"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-gray-900 dark:text-white" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-900 dark:text-white" />
          )}
        </button>
        {/* Notification Bell */}
        <div className="relative" ref={containerRef}>
          <button
            onClick={() => setOpen(prev => !prev)}
            className="focus:outline-none"
            aria-label="Notifications"
          >
            <BellIcon className="h-6 w-6 text-gray-900 dark:text-white" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded shadow-lg z-50">
              <ul>
                {alerts.map((a, idx) => {
                  const Icon = a.icon;
                  return (
                    <li key={idx}>
                      <NavLink
                        to={a.link}
                        className="flex items-center px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-2" />
                        <span>{a.text}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        </div>
      </div>
  );
};

export default TopPanel;