import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#f97316',
          light: '#fb923c',
          dark: '#ea580c',
          contrast: '#ffffff',
        },
        surface: {
          DEFAULT: '#ffffff',
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
        sans: ['Inter var', 'Manrope', 'sans-serif'],
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
      },
      boxShadow: {
        soft: '0 15px 35px rgba(15, 23, 42, 0.08)',
        card: '0 24px 50px rgba(15, 23, 42, 0.12)',
        focus: '0 0 0 4px rgba(14, 165, 233, 0.20)',
      },
      backgroundImage: {
        'gradient-student': 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 55%, #0369a1 100%)',
        'gradient-teacher': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 60%, #c026d3 100%)',
      },
    },
  },
  plugins: [
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
          backgroundColor: theme('colors.brand.DEFAULT'),
          color: theme('colors.text.inverse'),
          boxShadow: theme('boxShadow.soft'),
          transition: 'all 150ms ease',
        },
        '.btn-primary:hover': {
          backgroundColor: theme('colors.brand.dark'),
          boxShadow: theme('boxShadow.card'),
        },
        '.btn-primary:focus-visible': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${theme('colors.brand.dark')}33, 0 0 0 4px ${theme('colors.surface.DEFAULT')}`,
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