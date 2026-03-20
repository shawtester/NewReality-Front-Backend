const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      // ✅ ADD THIS ANIMATION SECTION
      animation: {
        attention: "attention 2s ease-in-out infinite",
      },
      keyframes: {
        attention: {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(219, 164, 13, 0.6)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 20px 6px rgba(219, 164, 13, 0.4)",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
  ],
};