export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "var(--border-color)",
        background: "var(--bg-color)",
        foreground: "var(--text-color)",
        card: "var(--card-bg)",
        "card-foreground": "var(--text-color)",
        primary: {
          DEFAULT: "#4F46E5", // Indigo 600
          hover: "#4338CA",
          light: "#EEF2F6",
        },
        secondary: {
          DEFAULT: "#06B6D4", // Cyan 500
          hover: "#0891B2",
        },
        accent: {
          DEFAULT: "#8B5CF6", // Violet 500
        },
        success: {
          DEFAULT: "#10B981", // Emerald 500
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber 500
        },
        danger: {
          DEFAULT: "#F43F5E", // Rose 500
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(79, 70, 229, 0.1)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      }
    },
  },
  plugins: [],
}
