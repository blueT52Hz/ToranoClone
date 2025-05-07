/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
      screens: {
        min450: "450px",
        min850: "850px",
        min1200: "1200px",
      },
      colors: {
        "shop-color-bg": "#ffffff",
        "shop-color-main": "#ff0000",
        "shop-color-text": "#000000",
        "shop-color-title": "#000000",
        "shop-color-hover": "#d60000",
        "shop-color-button": "#ffffff",
        "shop-color-button-text": "#ca0000",
        "shop-color-border": "#e7e7e7",
        "header-bg": "#ffffff",
        "header-color-text": "#333333",
        "topbar-bg": "#242021",
        "topbar-color-text": "#ffffff",
        "home-coupon-bg": "#ffffff",
        "home-coupon-light": "#ffffff",
        "home-coupon-border": "#f8d0d3",
        "home-coupon-text": "#333333",
        "footer-bg-color-1": "#000000",
        "footer-bg-color-2": "#f5f5f5",
        "footer-bg-color-copyright": "#f5f5f5",
        "footer-color-title": "#d60000",
        "footer-color-text": "#000000",
        "footer-color-hover": "#e3e2e2",
        "home-flashsale-bg": "#fff9f9",
        "home-flashsale-color-title": "#000000",
        "home-flashsale-color-light": "#FF0000",
        "home-flashsale-countdown-bg": "#FF0000",
        "home-flashsale-countdown-color-txt": "#000000",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
