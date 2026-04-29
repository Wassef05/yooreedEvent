/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark background layers
        navy: {
          950: '#050709',
          900: '#080C14',
          800: '#0D1120',
          700: '#111827',
          600: '#1a2235',
          500: '#1e2d45',
        },
        // Primary violet (brand)
        violet: {
          50: '#f3eeff',
          100: '#e4d5ff',
          200: '#c8aaff',
          300: '#a97eff',
          400: '#8b52ff',
          500: '#7C3AED',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1575',
        },
        // Cyan accent (futuristic)
        cyber: {
          50: '#e0faff',
          100: '#b3f4ff',
          200: '#7feeff',
          300: '#49e8ff',
          400: '#00D4FF',
          500: '#00b8e6',
          600: '#0099c7',
          700: '#007aa8',
          800: '#005c8a',
          900: '#003d6b',
        },
        // Warm gold (premium accents)
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#F5B544',
          600: '#d97706',
        },
        // Semantic
        charcoal: '#0D0F1A',
        sand: '#F9F5FF',
        lilac: '#E7DBEF',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        pure: '#FFFFFF',
        pearl: '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-violet': '0 0 30px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.15)',
        'glow-cyan': '0 0 30px rgba(0, 212, 255, 0.35), 0 0 60px rgba(0, 212, 255, 0.1)',
        'glow-gold': '0 0 20px rgba(245, 181, 68, 0.3)',
        'card-dark': '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), 0 8px 24px rgba(124,58,237,0.2)',
        'neon': '0 0 5px theme("colors.cyber.400"), 0 0 20px theme("colors.cyber.400"), 0 0 40px theme("colors.violet.500")',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
        'glow': '0 10px 40px rgba(124, 58, 237, 0.35)',
        'card': '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(0,212,255,0.2)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        'hero-gradient': 'linear-gradient(135deg, #050709 0%, #0D1120 40%, #111827 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'violet-gradient': 'linear-gradient(135deg, #7C3AED 0%, #5b21b6 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
    },
  },
  plugins: [],
}
