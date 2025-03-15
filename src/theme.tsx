import React from 'react';
import { createTheme } from '@mui/material';

const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: mode === 'light' ? '#FF8A65' : '#FFAB91', // Softer coral
        main: mode === 'light' ? '#FF7043' : '#FF5722', // More vibrant in dark mode
        dark: mode === 'light' ? '#F4511E' : '#E64A19', // Deeper accent
        contrastText: '#FFFFFF', // Ensuring white text on primary buttons for legibility
      },
      secondary: {
        light: mode === 'light' ? '#64D8CB' : '#B2DFDB', // Lighter teal
        main: mode === 'light' ? '#4DB6AC' : '#009688', // More saturated in dark mode
        dark: mode === 'light' ? '#26A69A' : '#00796B', // Deeper teal
        contrastText: mode === 'light' ? '#212121' : '#FFFFFF', // Dark text on light, white on dark
      },
      background: {
        default: mode === 'light' ? '#F5F5F5' : '#121212', // Lighter gray for light, darker for dark
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E', // White for light, softer dark for dark
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#F5F5F5', // Near black and near white for high contrast
        secondary: mode === 'light' ? '#757575' : '#BDBDBD', // Medium gray for both, darker in light mode
      },
      error: {
        main: mode === 'light' ? '#D32F2F' : '#FF5252', // Consistent error color
        contrastText: '#FFFFFF', // White text on error for readability
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { 
        fontWeight: 600, 
        fontSize: '2.5rem',
        color: mode === 'light' ? '#212121' : '#F5F5F5', // Ensure heading contrast
      },
      h2: { 
        fontWeight: 600, 
        fontSize: '2rem',
        color: mode === 'light' ? '#212121' : '#F5F5F5',
      },
      h3: { 
        fontWeight: 600, 
        fontSize: '1.75rem',
        color: mode === 'light' ? '#212121' : '#F5F5F5',
      },
      h4: { 
        fontWeight: 600, 
        fontSize: '1.5rem',
        letterSpacing: '0.0075em',
        color: mode === 'light' ? '#212121' : '#F5F5F5',
      },
      h5: { 
        fontWeight: 600, 
        fontSize: '1.25rem',
        color: mode === 'light' ? '#212121' : '#F5F5F5',
      },
      h6: { 
        fontWeight: 600, 
        fontSize: '1.1rem',
        color: mode === 'light' ? '#212121' : '#F5F5F5',
      },
      body1: { 
        fontSize: '1rem', 
        lineHeight: 1.6,
        color: mode === 'light' ? '#212121' : '#EEEEEE', // Slightly off-white for dark mode
      },
      body2: { 
        fontSize: '0.875rem', 
        lineHeight: 1.6,
        color: mode === 'light' ? '#424242' : '#E0E0E0',
      },
      button: { 
        textTransform: 'none', 
        fontWeight: 500, 
        letterSpacing: '0.02857em',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0 4px 6px rgba(0,0,0,0.1)' 
              : '0 4px 6px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: '0.95rem',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.8rem',
            backgroundColor: mode === 'light' ? 'rgba(97, 97, 97, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: mode === 'light' ? '#fff' : '#121212',
          },
        },
      },
    },
  });

export default getTheme;