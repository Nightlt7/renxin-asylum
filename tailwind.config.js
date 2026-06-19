/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        asylum: {
          900: '#0f1115',
          800: '#181b21',
          700: '#22262e',
          600: '#2e343d',
          500: '#3e4651',
          accent: '#8b1e1e',
          muted: '#8a9199',
          paper: '#e8e4dc',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        flicker: 'flicker 3s infinite',
        shake: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.95 },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(3px, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
}
