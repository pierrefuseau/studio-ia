/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fuseau: {
          primary: '#C8102E',
          'primary-dark': '#A00D25',
          'primary-light': '#E8253F',
          secondary: '#0F1D3D',
          'secondary-dark': '#0A1428',
          'secondary-light': '#1A2D54',
          accent: '#E88C30',
          'accent-dark': '#D07A20',
          'accent-light': '#F4A24E',
          cream: '#FBF8F2',
          beige: '#F5F0E6',
          sand: '#EBE4D4',
        },
        cream: {
          50: '#FEFCF9',
          100: '#FDF8F0',
          200: '#FAF0E4',
          300: '#F5E6D4',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Inter', 'Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideInRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(15, 29, 61, 0.04)',
        'md': '0 4px 6px -1px rgba(15, 29, 61, 0.06), 0 2px 4px -2px rgba(15, 29, 61, 0.04)',
        'lg': '0 10px 15px -3px rgba(15, 29, 61, 0.06), 0 4px 6px -4px rgba(15, 29, 61, 0.04)',
        'xl': '0 20px 25px -5px rgba(15, 29, 61, 0.06), 0 8px 10px -6px rgba(15, 29, 61, 0.04)',
        'card': '0 1px 3px rgba(15, 29, 61, 0.06), 0 1px 2px rgba(15, 29, 61, 0.04)',
        'card-hover': '0 10px 20px -5px rgba(15, 29, 61, 0.08), 0 4px 6px -2px rgba(15, 29, 61, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
