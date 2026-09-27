/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        night: "#05070C",
        panel: "#0B1220",
        card: "#101A2C",
        edge: "#1D2A44",
        mist: "#8CA0BE",
        teal: "#2DD4BF",
        tealdeep: "#0D9488",
        lav: "#818CF8",
        danger: "#F87171",
      },
      fontFamily: {
        display: ['"Unbounded"', "sans-serif"],
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        scan: "scan 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
