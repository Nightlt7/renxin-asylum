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
          'accent-light': '#a52a2a',
          muted: '#8a9199',
          paper: '#e8e4dc',
          // 新增：与暗黑主题协调的功能色
          success: '#4a6741',      // 暗橄榄绿，替代亮绿
          warning: '#7a6230',      // 暗琥珀，用于提示
          highlight: '#c9a54b',    // 金色微光，用于重要高亮
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
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline-drift': 'scanline-drift 8s linear infinite',
        'breath': 'breath 4s ease-in-out infinite',
        'stagger-fade-in': 'stagger-fade-in 0.5s ease-out both',
        'draw-line': 'draw-line 0.6s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(3px, 0, 0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(139,30,30,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(139,30,30,0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'scanline-drift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' },
        },
        'breath': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'stagger-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: '0%' },
        },
      },
    },
  },
  plugins: [],
}
