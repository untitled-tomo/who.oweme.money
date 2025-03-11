import React from 'react';
import { IconButton, Tooltip, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode

interface ThemeToggleProps {
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Tooltip title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(30deg)',
          },
        }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 