/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // App directory
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages (if exists)
    "./components/**/*.{js,ts,jsx,tsx}" // Components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
