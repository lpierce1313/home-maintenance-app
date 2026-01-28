'use client';
import { createTheme, alpha } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4ade80',
      contrastText: '#020617', 
    },
    error: {
      main: '#f98b8b', // Soft Coral
      light: '#fca5a5',
      dark: '#b91c1c',
      contrastText: '#020617',
    },
    warning: {
      main: '#fbbf24',
    },
    background: {
      default: '#020617',
      paper: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1', // Bumped up slightly from #94a3b8 for better legibility
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: '12px',
          border: `1px solid ${alpha(theme.palette[ownerState.severity || 'info'].main, 0.2)}`,
          backgroundColor: '#0f172a', // Match paper depth
          color: theme.palette.text.primary,
        }),
        icon: ({ ownerState, theme }) => ({
          // Ensures the icon pops against the muted background
          color: theme.palette[ownerState.severity || 'info'].main,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Modern touch for this palette
          fontWeight: 600,
        },
      },
    },
  },
});