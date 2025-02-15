/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
      screens: {
        min850: "850px",
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
      },
    },
  },
  plugins: [],
};
