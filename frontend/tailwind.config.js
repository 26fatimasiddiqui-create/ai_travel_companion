/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FFFEFA',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EBE2D8',
        },
        sand: {
          100: '#F5EFE6',
          200: '#EBDDCF',
          300: '#DEC9B4',
          400: '#CBB299',
          500: '#B89B7D',
        },
        terracotta: {
          50: '#FDF5F2',
          100: '#F9E5DE',
          200: '#F2C8BC',
          300: '#E8A492',
          400: '#DE7858',
          500: '#C85A32',
          600: '#B04722',
          700: '#8E3416',
        },
        sage: {
          50: '#F5F7F4',
          100: '#E4EAE2',
          200: '#C9D6C6',
          300: '#A7BCA3',
          400: '#859F81',
          500: '#688464',
          600: '#516B4D',
          700: '#3D523A',
        },
        charcoal: {
          100: '#E7E5E4',
          200: '#D6D3D1',
          300: '#A8A29E',
          400: '#78716C',
          500: '#57534E',
          600: '#44403C',
          700: '#292524',
          800: '#1C1917',
          900: '#0C0A09',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(184, 155, 125, 0.15)',
        'warm-lg': '0 10px 25px -3px rgba(184, 155, 125, 0.2), 0 4px 6px -2px rgba(184, 155, 125, 0.1)',
        'soft': '0 2px 10px rgba(41, 37, 36, 0.04)',
      }
    },
  },
  plugins: [],
}
