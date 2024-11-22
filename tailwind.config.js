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