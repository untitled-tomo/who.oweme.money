import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar, useTheme } from '@mui/material';
import ThemeToggle from '../../components/ThemeToggle';
import { useThemeContext } from '../../App';

const WelcomePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { toggleTheme } = useThemeContext();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header with Theme Toggle */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Who Owe Me Money
          </Typography>
          <ThemeToggle toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to WhoOweMeMoney! 🍽️
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '600px', mb: 2 }}>
          Ever had a tough time splitting the bill after a meal with friends? Worry no more!
        </Typography>
        <Box sx={{ 
          backgroundColor: theme.palette.background.paper,
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%',
          mb: 4
        }}>
          <Typography variant="h6" gutterBottom>
            Here's how to make bill-splitting as easy as pie:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', pl: 2 }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              📋 Start by entering your group size and friends' names.
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              🍕 Add menu items and who enjoyed each dish.
            </Typography>
            <Typography component="li" variant="body1">
              💸 Specify who paid and calculate splits.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/app')}
          sx={{ 
            padding: '12px 24px',
            fontSize: '1rem'
          }}
        >
          Get Started
        </Button>
      </Box>

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

export default WelcomePage;
