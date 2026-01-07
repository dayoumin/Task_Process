/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Monochrome System (Linear/Vercel inspired)
        gray: {
          50: 'rgb(250 250 250)',
          100: 'rgb(245 245 245)',
          200: 'rgb(229 229 229)',
          300: 'rgb(212 212 212)',
          400: 'rgb(163 163 163)',
          500: 'rgb(115 115 115)',
          600: 'rgb(82 82 82)',
          700: 'rgb(64 64 64)',
          800: 'rgb(38 38 38)',
          900: 'rgb(23 23 23)',
        },
        blue: {
          50: 'rgb(239 246 255)',
          500: 'rgb(59 130 246)',
          600: 'rgb(37 99 235)',
        },
        green: {
          50: 'rgb(240 253 244)',
          500: 'rgb(34 197 94)',
          600: 'rgb(22 163 74)',
        },
        amber: {
          50: 'rgb(255 251 235)',
          500: 'rgb(245 158 11)',
          600: 'rgb(217 119 6)',
        },
        red: {
          50: 'rgb(254 242 242)',
          500: 'rgb(239 68 68)',
          600: 'rgb(220 38 38)',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.08)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.08)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.08)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
