/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F7942", // Forest Green
        "primary-dark": "#3B5D33",
        "primary-light": "#6B9958",
        "primary-dull": "#8FB382",
        secondary: "#FF8C00", // Dark Orange
        accent: "#FFA500", // Orange
        background: "#F9F9F9",
        "text-dark": "#333333",
        "text-light": "#666666",
        "text-muted": "#999999",
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} 