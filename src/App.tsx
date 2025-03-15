import React, { useState, createContext, useContext } from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider, CssBaseline, useMediaQuery } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import router from './router';
import getTheme from './theme';

// Create a theme context to share theme state and toggle function
export interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
});

// Hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

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
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

App.displayName = 'WhoOweMeMoney';
export default App;
