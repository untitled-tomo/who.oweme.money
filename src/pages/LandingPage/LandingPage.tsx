import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { createBrowserRouter } from 'react-router'; // Ensuring you're using the correct package

const LandingPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 3,
        backgroundColor: '#FFF8E1',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Who.OweMe.Money! 🍽️
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Easily split bills with friends. Add people, menu items, and calculate who owes what!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/welcome')}
        sx={{ padding: '10px 20px', fontSize: '1.2rem' }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default LandingPage;
