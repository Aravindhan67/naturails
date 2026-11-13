/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          50: '#F4F7F2',
          100: '#E6ECE2',
          200: '#CFDAC8',
          300: '#AEC0A4',
          400: '#869F79',
          500: '#5F7F51',
          600: '#48633C',
          700: '#384E2E',
          800: '#2B3D23',
          900: '#202E1A',
        },
        earth: {
          50: '#FBF9F5',
          100: '#F5EFE6',
          200: '#ECE2D2',
          300: '#DFCFB8',
          400: '#CDB797',
          500: '#B89D77',
          600: '#9B7E5A',
          700: '#7B6244',
          800: '#5F4B34',
          900: '#473727',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#FBEDE7',
          200: '#F5D7CA',
          300: '#EDB7A2',
          400: '#DF8F71',
          500: '#C27351',
          600: '#A95836',
          700: '#8A4428',
          800: '#6E3721',
          900: '#562D1C',
        },
        cream: {
          light: '#FDFBF7',
          DEFAULT: '#F8F5EE',
          dark: '#EFE9DD',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 60, 47, 0.06), 0 2px 6px -1px rgba(45, 60, 47, 0.04)',
        'card': '0 12px 32px -4px rgba(45, 60, 47, 0.08), 0 4px 12px -2px rgba(45, 60, 47, 0.04)',
        'glow': '0 0 25px rgba(95, 127, 81, 0.18)',
      }
    },
  },
  plugins: [],
}
