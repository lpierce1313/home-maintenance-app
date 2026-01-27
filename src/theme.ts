'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2e7d32' }, // Green for home/growth
    secondary: { main: '#1976d2' }, // Blue for maintenance
  },
});

export default theme;