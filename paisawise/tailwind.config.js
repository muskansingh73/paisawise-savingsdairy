export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      colors: {
        rupee: {
          50: "#E1F5EE", 100: "#9FE1CB", 200: "#5DCAA5",
          400: "#1D9E75", 600: "#0F6E56", 800: "#085041", 900: "#04342C"
        },
        flame: {
          50: "#FAECE7", 100: "#F5C4B3",
          400: "#D85A30", 600: "#993C1D", 800: "#712B13"
        },
        ink: {
          50: "#F5F4F1", 100: "#E4E2DA", 200: "#C8C5BB",
          400: "#8C8980", 600: "#5C5A54", 800: "#2E2D29", 900: "#1A1917"
        },
        sapphire: {
          50: "#E6F1FB", 100: "#B5D4F4",
          400: "#378ADD", 600: "#185FA5", 800: "#0C447C"
        },
        amber: {
          50: "#FAEEDA", 100: "#FAC775",
          400: "#EF9F27", 600: "#BA7517", 800: "#633806"
        },
        violet: {
          50: "#EEEDFE", 100: "#CECBF6",
          400: "#7F77DD", 600: "#534AB7", 800: "#3C3489"
        }
      }
    }
  },
  plugins: []
}