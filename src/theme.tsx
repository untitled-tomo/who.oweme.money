import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';

const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: mode === 'light' ? '#FF8A65' : '#FFAB91', // Softer coral
        main: mode === 'light' ? '#FF7043' : '#FF5722', // More vibrant in dark mode
        dark: mode === 'light' ? '#F4511E' : '#E64A19', // Deeper accent
      },
      secondary: {
        light: mode === 'light' ? '#64D8CB' : '#B2DFDB', // Lighter teal
        main: mode === 'light' ? '#4DB6AC' : '#009688', // More saturated in dark mode
        dark: mode === 'light' ? '#26A69A' : '#00796B', // Deeper teal
      },
      background: {
        default: mode === 'light' ? '#FFF8E1' : '#212121', // Softer cream to dark gray
        paper: mode === 'light' ? '#FFFFFF' : '#2C2C2C', // Brighter white to slightly lighter dark
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#E0E0E0', // High contrast
        secondary: mode === 'light' ? '#616161' : '#B0BEC5', // Refined muted colors
      },
      error: {
        main: mode === 'light' ? '#D32F2F' : '#FF5252', // Consistent error color
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h1: { fontWeight: 600, fontSize: '2.5rem' },
      h4: { fontWeight: 600, letterSpacing: '0.0075em' },
      body1: { 
        fontSize: '1rem', 
        lineHeight: 1.6,
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
    },
  });

export default getTheme;