/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          bg: '#F5F1EB',
          surface: '#EAE4DC',
          card: '#FFFFFF',
          text: '#111215',
          muted: '#6B6862',
        },
        dark: {
          bg: '#0D0E11',
          surface: '#16171B',
          card: '#18191E',
          elevated: '#202229',
          text: '#F7F7F8',
          muted: '#8E9099',
        },
        door: {
          blue: '#1E3A5F',
          purple: '#483E54',
          green: '#5B7A63',
          orange: '#A65236',
        },
        brass: {
          light: '#F5E2A8',
          DEFAULT: '#C8A355',
          dark: '#8C6A24',
        },
        accent: {
          green: '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

