import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#c2410c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#334155',
      contrastText: '#ffffff',
    },
    gradient: {
      student: 'linear-gradient(135deg, #f97316 0%, #fb7185 55%, #ef4444 100%)',
      teacher: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 60%, #c026d3 100%)',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter var", "Manrope", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.005em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '9999px',
          fontWeight: 600,
          paddingInline: '1.25rem',
          paddingBlock: '0.625rem',
          boxShadow: '0 10px 40px rgba(249, 115, 22, 0.25)',
        },
        containedSecondary: {
          boxShadow: '0 10px 40px rgba(100, 116, 139, 0.25)',
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
          boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
        },
        elevation1: {
          boxShadow: '0 12px 30px rgba(14, 165, 233, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1.25rem',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          boxShadow: '0 24px 45px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.5rem',
          },
        },
      },
    },
  },
});

export default theme;