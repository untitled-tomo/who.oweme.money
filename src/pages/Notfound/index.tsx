import React, { memo } from 'react';
import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';

const Notfound: React.FC = memo(() => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 3,
        textAlign: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: '600px',
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Typography variant="h3" component="h1" color="primary" gutterBottom fontWeight="bold">
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          sx={{ 
            padding: '10px 20px',
            fontSize: '1rem'
          }}
        >
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
});

Notfound.displayName = 'Notfound';

export default Notfound;
