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
          libre: "#22c55e",
          ocupado: "#ef4444",
          conductor: "#3b82f6",
          guia: "#a855f7",
          desasignado: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
