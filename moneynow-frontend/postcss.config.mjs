<<<<<<< HEAD
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // App Router pages
    "./components/**/*.{js,ts,jsx,tsx}", // Components
    "./pages/**/*.{js,ts,jsx,tsx}",      // Optional, if you have pages folder
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        geist: ["var(--font-geist-sans)", "sans-serif"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
=======
const config = {
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
  plugins: ["@tailwindcss/postcss"],
};

export default config;
