import React from "react";

interface ThemeToggleProps {
  darkMode: boolean;
  toggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, toggle }) => (
  <button
    onClick={toggle}
    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
  >
    {darkMode ? "Light Mode" : "Dark Mode"}
  </button>
);

export default ThemeToggle;