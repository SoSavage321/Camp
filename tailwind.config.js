/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6',
          'primary-contrast': '#FFFFFF',
          secondary: '#10B981',
          accent: '#F59E0B',
        },
        fg: {
          default: '#111827',
          muted: '#6B7280',
        },
        bg: {
          canvas: '#FFFFFF',
          surface: '#F9FAFB',
          elevated: '#FFFFFF',
        },
        border: {
          default: '#E5E7EB',
        },
        state: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'full': '999px',
      }
    },
  },
  plugins: [],
};
