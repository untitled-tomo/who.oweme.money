import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, CssBaseline } from '@mui/material';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <CssBaseline />
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
          backgroundColor: '#f4f4f4',
          color: '#666',
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
