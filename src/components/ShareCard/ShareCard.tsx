import React, { useRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useTheme } from '@mui/material';

interface MenuItem {
  name: string;
  amount: number;
  peopleInvolved: string[];
}

interface ShareCardProps {
  people: Record<string, string>;
  menu: MenuItem[];
  taxRate: number;
  payer: string;
  onShareImage: (cardElement: HTMLElement) => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ people, menu, taxRate, payer, onShareImage }) => {
  const theme = useTheme();
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Calculate owed amounts
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

  const calculateTotalAmount = () => {
    return menu.reduce((total, item) => total + item.amount, 0);
  };

  const totalAmount = calculateTotalAmount();
  const taxAmount = (totalAmount * taxRate) / 100;
  const grandTotal = totalAmount + taxAmount;

  return (
    <Box mb={3}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => shareCardRef.current && onShareImage(shareCardRef.current)}
        sx={{ mb: 2 }}
      >
        Share Summary
      </Button>
      
      <Paper 
        ref={shareCardRef} 
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          maxWidth: '600px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
            Who Owe Me Money
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Bill Split by {people[payer]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>

        {payer && (
          <>
            <Typography variant="h6" gutterBottom>
              {people[payer]} paid the bill
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Person</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount Owed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(people).map(([id, name]) => (
                    id !== payer && (
                      <TableRow key={id}>
                        <TableCell>{name}</TableCell>
                        <TableCell align="right">
                          ${owedAmounts[id].toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bill Details
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Subtotal:</Typography>
            <Typography>${totalAmount.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Tax ({taxRate}%):</Typography>
            <Typography>${taxAmount.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography>Total:</Typography>
            <Typography>${grandTotal.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Menu Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Shared By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menu.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.peopleInvolved.map(id => people[id]).join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ textAlign: 'center', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary">
            Generated with Who Owe Me Money
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ShareCard; 