/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1B2D',
          soft: '#3B4A5E',
        },
        primary: {
          50: '#EAF1F8',
          100: '#CFE0EE',
          200: '#A3C2DC',
          300: '#749FC5',
          400: '#4A7BAA',
          500: '#2F5A87',
          600: '#1F3A5C',
          700: '#182E49',
          800: '#122237',
          900: '#0B1626',
        },
        teal: {
          50: '#E7F9F6',
          100: '#C3F0E8',
          200: '#8FE0D2',
          300: '#54CBB8',
          400: '#22B39D',
          500: '#0D9C8F',
          600: '#0A7E75',
          700: '#08635F',
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F5F8F9',
          dim: '#EDF2F3',
        },
        darksurface: {
          DEFAULT: '#0B1420',
          raised: '#101D2E',
          card: '#132435',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(15, 27, 45, 0.08)',
        card: '0 12px 40px -12px rgba(15, 27, 45, 0.18)',
        glow: '0 0 0 1px rgba(13, 156, 143, 0.15), 0 8px 30px -8px rgba(13, 156, 143, 0.35)',
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #1F3A5C 0%, #0D9C8F 100%)',
        'grad-hero': 'linear-gradient(180deg, #EAF1F8 0%, #F5F8F9 100%)',
        'grad-cta': 'linear-gradient(120deg, #0D9C8F 0%, #38BDF8 100%)',
      },
      animation: {
        pulseLine: 'pulseLine 2.4s ease-in-out infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        floatSlower: 'floatSlower 9s ease-in-out infinite',
      },
      keyframes: {
        pulseLine: {
          '0%, 100%': { strokeDashoffset: 0 },
          '50%': { strokeDashoffset: -40 },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        floatSlower: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};
