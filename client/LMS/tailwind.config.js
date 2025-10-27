import plugin from 'tailwindcss/plugin';

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
        // Brand Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Base primary color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Semantic Colors
        success: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#065f46',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#92400e',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        // Surface Colors
        surface: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#0f172a',
          muted: '#f1f5f9',
          subtle: '#f8fafc',
        },
        background: {
          DEFAULT: '#f8fafc',
          elevated: '#ffffff',
        },
        border: {
          subtle: '#e2e8f0',
          strong: '#cbd5e1',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8',
          inverse: '#ffffff',
        },
        status: {
          success: '#16a34a',
          warning: '#f59e0b',
          danger: '#dc2626',
          info: '#0ea5e9',
        },
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        montserrat: ['"Montserrat"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'full': '9999px',
      },
      boxShadow: {
        soft: '0 15px 35px rgba(15, 23, 42, 0.08)',
        card: '0 24px 50px rgba(15, 23, 42, 0.12)',
        focus: '0 0 0 4px rgba(14, 165, 233, 0.20)',
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      backgroundImage: {
        'gradient-student': 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 55%, #0369a1 100%)',
        'gradient-teacher': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 60%, #c026d3 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      transitionDuration: {
        'DEFAULT': '200ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    plugin(function ({ addBase, addComponents, theme }) {
      const sans = theme('fontFamily.sans');
      const fontSans = Array.isArray(sans) ? sans.join(', ') : sans;

      addBase({
        html: {
          fontFamily: fontSans,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: theme('colors.background.DEFAULT'),
          color: theme('colors.text.primary'),
        },
        body: {
          margin: 0,
          backgroundColor: theme('colors.background.DEFAULT'),
          color: theme('colors.text.primary'),
        },
      });

      addComponents({
        '.btn-primary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: theme('spacing.6'),
          paddingBlock: theme('spacing.3'),
          borderRadius: theme('borderRadius.full'),
          fontWeight: theme('fontWeight.semibold'),
          backgroundColor: theme('colors.primary.500'),
          color: theme('colors.primary-foreground', '#ffffff'),
          boxShadow: theme('boxShadow.soft'),
          transition: 'all 150ms ease',
        },
        '.btn-primary:hover': {
          backgroundColor: theme('colors.primary.600'),
          boxShadow: theme('boxShadow.card'),
        },
        '.btn-primary:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${theme('colors.primary.400')}66, 0 0 0 4px ${theme('colors.surface.DEFAULT')}`,
        },
        '.btn-primary:disabled': {
          cursor: 'not-allowed',
          opacity: '0.7',
        },
        '.btn-secondary': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: theme('spacing.6'),
          paddingBlock: theme('spacing.3'),
          borderRadius: theme('borderRadius.full'),
          fontWeight: theme('fontWeight.semibold'),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme('colors.border.subtle'),
          backgroundColor: theme('colors.surface.DEFAULT'),
          color: theme('colors.text.secondary'),
          transition: 'all 150ms ease',
        },
        '.btn-secondary:hover': {
          backgroundColor: theme('colors.surface.muted'),
          borderColor: theme('colors.border.strong'),
          color: theme('colors.text.primary'),
        },
        '.btn-secondary:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${theme('colors.brand.DEFAULT')}33, 0 0 0 4px ${theme('colors.surface.DEFAULT')}`,
        },
        '.card': {
          borderRadius: theme('borderRadius.3xl'),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme('colors.border.subtle'),
          backgroundColor: theme('colors.surface.DEFAULT'),
          boxShadow: theme('boxShadow.soft'),
          backdropFilter: 'blur(12px)',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
        },
        '.card:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme('boxShadow.card'),
        },
        '.input-field': {
          width: '100%',
          borderRadius: theme('borderRadius.xl'),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme('colors.border.subtle'),
          backgroundColor: theme('colors.surface.DEFAULT'),
          paddingInline: theme('spacing.4'),
          paddingBlock: theme('spacing[2.5]') ?? '0.625rem',
          fontSize: theme('fontSize.base')[0],
          lineHeight: theme('fontSize.base')[1].lineHeight,
          color: theme('colors.text.primary'),
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        },
        '.input-field::placeholder': {
          color: theme('colors.text.muted'),
        },
        '.input-field:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${theme('colors.brand.DEFAULT')}33, 0 0 0 4px ${theme('colors.surface.DEFAULT')}`,
          borderColor: theme('colors.brand.DEFAULT'),
        },
        '.input-field[data-state="error"]': {
          borderColor: theme('colors.status.danger'),
        },
        '.input-field[data-state="error"]:focus-visible': {
          boxShadow: `0 0 0 2px ${theme('colors.status.danger')}33, 0 0 0 4px ${theme('colors.surface.DEFAULT')}`,
        },
        '.form-label': {
          display: 'block',
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.text.secondary'),
        },
      });
    }),
  ],
};




