// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx, html}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          purple: '#AF4D98',
          pink: '#D66BA0',
          gold: '#E5A919',
          cream: '#F4E4BA',
          mint: '#9DF7E5',
          
          violet: {
            100: "#A5B4FB",
            200: "#A8A6FF",
            300: "#918efa",
            400: "#807dfa",
          },
          pink: {
            200: "#FFA6F6",
            300: "#fa8cef",
            400: "#fa7fee",
          },
          red: {
            200: "#FF9F9F",
            300: "#fa7a7a",
            400: "#f76363",
          },
          orange: {
            200: "#FFC29F",
            300: "#FF965B",
            400: "#fa8543",
          },
          yellow: {
            200: "#FFF59F",
            300: "#FFF066",
            400: "#FFE500",
          },
          lime: {
            100: "#c6fab4",
            200: "#B8FF9F",
            300: "#9dfc7c",
            400: "#7df752",
          },
          cyan: {
            200: "#A6FAFF",
            300: "#79F7FF",
            400: "#53f2fc",
          },
        },
      },
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#AF4D98",
          "secondary": "#D66BA0",
          "accent": "#E5A919",
          "neutral": "#F4E4BA",
          "base-100": "#ffffff",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
}

