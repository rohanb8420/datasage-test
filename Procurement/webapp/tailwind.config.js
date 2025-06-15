module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Card background for dark theme
        carddark: '#1F1F1F',
        // Off-white background for light theme UI chrome
        offwhite: '#F5F5F5',
      },
    },
  },
  plugins: []
};