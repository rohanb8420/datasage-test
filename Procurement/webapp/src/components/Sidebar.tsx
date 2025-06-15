import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { sidebarItems } from "../config/sidebarItems";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };
  return (
    <aside className={`bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-400 h-full flex flex-col transition-all duration-150 ${collapsed ? "w-16" : "w-64"}`}>
      <nav className="mt-4 flex-1">
        <ul>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path || '#'}
                  end
                className={({ isActive }) =>
                    `flex items-center p-2 mx-2 rounded transition-all duration-150 ${
                      isActive
                        ? 'font-bold text-black dark:text-white border-l-2 border-black dark:border-white'
                        : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => {
                    const colorClass = isActive
                      ? 'text-black dark:text-white'
                      : 'text-gray-600 dark:text-gray-400';
                    return (
                      <>
                        <Icon className={`h-6 w-6 ${colorClass}`} />
                        {!collapsed && <span className="ml-3">{item.name}</span>}
                      </>
                    );
                  }}
                </NavLink>
                {!collapsed && item.children && (
                  <ul>
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <li key={child.name}>
                          <NavLink
                            to={child.path!}
                        className={({ isActive }) =>
                              `flex items-center p-2 mx-2 ml-8 rounded transition-all duration-150 ${
                                isActive
                                  ? 'font-bold text-black dark:text-white border-l-2 border-black dark:border-white'
                                  : 'text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-900'
                              }`
                            }
                          >
                            {({ isActive }) => {
                              const childColor = isActive
                                ? 'text-black dark:text-white'
                                : 'text-gray-600 dark:text-gray-400';
                              return (
                                <>
                                  <ChildIcon className={`h-5 w-5 ${childColor}`} />
                                  <span className="ml-2">{child.name}</span>
                                </>
                              );
                            }}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 flex flex-col items-center">
        {/* Logo container */}
        <div className="p-2 mb-2 w-full flex items-center justify-center">
          <img
            src="/darklogo.png"
            alt="Logo"
            className="max-w-full h-auto"
          />
        </div>
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 focus:outline-none text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded"
          aria-label="Toggle collapse"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;