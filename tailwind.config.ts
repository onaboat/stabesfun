import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wild-black': '#06260F',
        'wild-white': '#ffffff',
        'wild-cream': '#F7F3EC',
        'wild-orange': '#FF5C39',
        'wild-green': '#00ED65',
        "wild-dark": "#00A123",
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        wildtheme: {
          "primary": "#FF5C39",    // Wild Thingz orange
          "secondary": "#00ED65",   // Wild Thingz green
          "accent": "#F7F3EC",      // Wild Thingz cream
          "neutral": "#000000",     // Black
          "base-100": "#ffffff",    // White
          "base-200": "#F7F3EC",    // Cream
          "info": "#00ED65",        // Green
          "success": "#00ED65",     // Green
          "warning": "#FF5C39",     // Orange
          "error": "#FF5C39",       // Orange

          "--rounded-box": "0",
          "--rounded-btn": "0",
          "--rounded-badge": "0",
          "--tab-radius": "0",
        },
      },
    ],
    darkTheme: "wildtheme",
  },
};
export default config;
