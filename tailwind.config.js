/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        betis: {
          green: "#00954C",
          dark: "#00381F",
          light: "#1bbf73",
        },
        seat: {
          libre: "#10b981",
          ocupado: "#cbd5e1",
          conductor: "#fbbf24",
          guia: "#c4b5fd",
        },
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
