import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';
import ThemeToggle from '../ThemeToggle';
import { useThemeContext } from '../../App';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { toggleTheme } = useThemeContext();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Who Owe Me Money
          </Typography>
          <ThemeToggle toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>
      
      {/* Content */}
      <Container
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          overflowX: 'auto',
          overflowY: 'auto',
        }}
      >
        {children}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          padding: 2,
          mt: 'auto',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} WhoOweMeMoney. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
