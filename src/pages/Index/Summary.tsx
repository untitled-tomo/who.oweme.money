import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SelectChangeEvent, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import MenuMain from './MenuMain';
import ShareCard from '../../components/ShareCard/ShareCard';
import { elementToDataUrl, shareImage } from '../../utils/imageUtils';

interface SummaryProps {
  people: Record<string, string>;
  taxRate: number;
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
}

const Summary: React.FC<SummaryProps> = ({ people, menu, taxRate = 0 }) => {
  const [payer, setPayer] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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

  const handleShareImage = async (element: HTMLElement) => {
    try {
      setIsProcessing(true);
      
      // Convert element to image data URL
      const dataUrl = await elementToDataUrl(element);
      
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

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Summary
      </Typography>
      <Box
        sx={{
          'flexDirection': { xs: 'column', sm: 'column', md: 'row' }, 
          gap:'28px',
          display:'flex'
        }}
        gap={10}
      >
        <Box>
          <FormControl fullWidth sx={{ mb: 2, minWidth: '180px' }}>
            <InputLabel sx={{background:'#f9f9f9'}}>Who Paid the Bill?</InputLabel>
            <Select value={payer} onChange={handlePayerChange}>
              {Object.entries(people).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {payer && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Person</TableCell>
                    <TableCell>Amount Owed to {people[payer]}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(people).map(([id, name]) => (
                    <TableRow key={id}>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        {id === payer ? '0.00' : owedAmounts[id].toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        <MenuMain
          isSummary={true}
          people={people}
          menu={menu}
          taxRate={taxRate}
        />
      </Box>

      {payer && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Share the Summary
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
              onShareImage={handleShareImage}
            />
          )}
        </Box>
      )}

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
  );
};

export default Summary;