import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Button, CircularProgress, Snackbar, Alert, Paper, useTheme, useMediaQuery, Stack, Divider } from '@mui/material';
import ShareCard from '../../components/ShareCard/ShareCard';
import { elementToDataUrl, shareImage } from '../../utils/imageUtils';
import SEO from '../../components/SEO';

interface SummaryProps {
  people: Record<string, string>;
  taxRate: number;
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
  onDone?: () => void; // Optional callback when Done is clicked
  onPrevious?: () => void; // Optional callback for Previous button
}

const Summary: React.FC<SummaryProps> = ({ people, menu, taxRate = 0, onDone, onPrevious }) => {
  const [payer, setPayer] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  // Reference to the ShareCard element for capturing
  const shareCardRef = React.useRef<HTMLElement | null>(null);

  const handlePayerChange = (event: SelectChangeEvent<string>) => {
    setPayer(event.target.value as string);
  };

  const calculateOwedAmounts = () => {
    const totals = Object.keys(people).reduce((acc, personId) => {
      acc[personId] = 0;
      return acc;
    }, {} as Record<string, number>);

    // Calculate base amounts
    menu.forEach((item) => {
      const amountPerPerson = item.amount / item.peopleInvolved.length;
      item.peopleInvolved.forEach((personId) => {
        totals[personId] += amountPerPerson;
      });
    });

    // Add tax to each person's total
    Object.keys(totals).forEach((personId) => {
      const personTax = (totals[personId] * taxRate) / 100;
      totals[personId] += personTax;
    });

    return totals;
  };

  const owedAmounts = calculateOwedAmounts();

  const handleShareImage = async () => {
    if (!shareCardRef.current) return;
    
    try {
      setIsProcessing(true);
      
      // Convert element to image data URL
      const dataUrl = await elementToDataUrl(shareCardRef.current);
      
      // Share the image
      await shareImage(dataUrl, 'who-owe-me-money-summary.png');
      
      setSnackbarMessage('Summary shared successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to share image:', error);
      setSnackbarMessage('Failed to share summary. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Reset all state to initial values
  const handleDone = () => {
    setPayer('');
    setIsProcessing(false);
    setSnackbarMessage('Summary cleared successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    
    // Call the onDone callback if provided
    if (onDone) {
      onDone();
    }
  };

  // Calculate total
  const totalBill = menu.reduce((acc, item) => acc + item.amount, 0);
  const totalTax = totalBill * (taxRate / 100);
  const grandTotal = totalBill + totalTax;

  const setShareCardElement = (element: HTMLElement) => {
    shareCardRef.current = element;
  };

  return (
    <>
      <SEO 
        title="Bill Summary - Who Owe Me Money" 
        description="View your bill split summary and share it with your friends."
        type="website"
      />
      
      <Box>
        <Typography variant="h6" mb={3}>
          Bill Summary
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 3 },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            width: '100%',
            mb: 4
          }}
        >
          {/* Left column - Summary Information */}
          <Paper 
            elevation={3}
            sx={{
              padding: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              flex: { md: '1 1 45%' },
              maxWidth: { md: '500px' },
              width: '100%'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 3, minWidth: '180px' }}>
                <InputLabel>Who Paid the Bill?</InputLabel>
                <Select value={payer} onChange={handlePayerChange}>
                  {Object.entries(people).map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle1" mb={1} fontWeight="medium">
                Bill Total: ${totalBill.toFixed(2)}
              </Typography>
              <Typography variant="subtitle1" mb={1} fontWeight="medium">
                Tax ({taxRate}%): ${totalTax.toFixed(2)}
              </Typography>
              <Typography variant="h6" mb={1} fontWeight="bold">
                Grand Total: ${grandTotal.toFixed(2)}
              </Typography>
            </Box>

            {payer && (
              <Box>
                <Typography variant="subtitle1" mb={2} fontWeight="bold">
                  {people[payer]} paid the bill. Here's what everyone owes:
                </Typography>
                
                {Object.entries(people).map(([id, name]) => (
                  id !== payer && (
                    <Box 
                      key={id} 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        py: 1.5
                      }}
                    >
                      <Typography>{name}</Typography>
                      <Typography fontWeight="medium">${owedAmounts[id].toFixed(2)}</Typography>
                    </Box>
                  )
                ))}
              </Box>
            )}
          </Paper>

          {/* Right column - Share Card */}
          {payer && (
            <Box 
              sx={{ 
                flex: { md: '1 1 55%' },
                maxWidth: { md: '600px' },
                width: '100%'
              }}
            >
              <Typography variant="h6" gutterBottom>
                Summary Preview
              </Typography>
              {isProcessing ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <CircularProgress size={24} />
                  <Typography>Generating shareable summary...</Typography>
                </Box>
              ) : (
                <ShareCard
                  people={people}
                  menu={menu}
                  taxRate={taxRate}
                  payer={payer}
                  onShareImage={setShareCardElement}
                  showButton={false}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Consolidated Buttons Section */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            maxWidth: '100%'
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            divider={<Divider orientation="vertical" flexItem />}
            justifyContent="center"
            alignItems="center"
          >
            {onPrevious && (
              <Button
                variant="outlined"
                onClick={onPrevious}
                sx={{ minWidth: '180px' }}
              >
                Previous
              </Button>
            )}
            
            {payer && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleShareImage}
                disabled={isProcessing}
                sx={{ minWidth: '180px' }}
              >
                {isProcessing ? 'Processing...' : 'Share Summary'}
              </Button>
            )}
            
            <Button
              variant="contained"
              color="success"
              onClick={handleDone}
              sx={{ minWidth: '180px' }}
            >
              Done
            </Button>
          </Stack>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Summary;