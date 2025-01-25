import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const WelcomePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {

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
        backgroundColor: '#FFF',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to WhoOweMeMoney! 🍽️
      </Typography>
      <Typography variant="body1" paragraph>
        Ever had a tough time splitting the bill after a meal with friends? Worry no more!
      </Typography>
      <Typography variant="body2" paragraph>
        Here's how to make bill-splitting as easy as pie:
        <ul style={{ textAlign: 'left', margin: '20px auto', maxWidth: '300px' }}>
          <li>📋 Start by entering your group size and friends' names.</li>
          <li>🍕 Add menu items and who enjoyed each dish.</li>
          <li>💸 Specify who paid and calculate splits.</li>
        </ul>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/app')}
        sx={{ marginTop: 3, padding: '10px 20px' }}
      >
        Proceed
      </Button>
    </Box>
  );
};

export default WelcomePage;
