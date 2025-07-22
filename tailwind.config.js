/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        dashboard: {
          sidebar: '#1C1E36',
          sidebarText: '#FFFFFF',
          sidebarActive: '#2A3D66',
          sidebarActiveBg: '#D6E6FF',
          mainBg: '#F7F8FC',
          cardBg: '#FFFFFF',
          headerText: '#8C8C8C',
          bodyText: '#2A3D66',
          approved: '#4ECB71',
          rejected: '#FF4D4F',
          pending: '#FFC107',
          formsCreated: '#A6D5FA',
          submissions: '#BBAEF8',
        }
      }
    },
  },
  plugins: [],
} 