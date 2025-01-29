import React, { useState } from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import router from './router';
import getTheme from './theme';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark' || prefersDarkMode
  );

  const theme = getTheme(darkMode ? 'dark' : 'light');

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <>
    {/* // <ThemeProvider theme={theme}> */}
      <CssBaseline />
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    {/* // </ThemeProvider> */}
    </>
  );
};

App.displayName = 'WhoOweMeMoney';
export default App;
