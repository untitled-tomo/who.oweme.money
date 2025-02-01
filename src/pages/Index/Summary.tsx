import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, SelectChangeEvent } from '@mui/material';

interface SummaryProps {
  people: Record<string, string>;
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
}

const Summary: React.FC<SummaryProps> = ({ people, menu }) => {
  const [payer, setPayer] = useState<string>('');

  const handlePayerChange = (event: SelectChangeEvent<string>) => {
    setPayer(event.target.value as string);
  };

  const calculateOwedAmounts = () => {
    const totals = Object.keys(people).reduce((acc, personId) => {
      acc[personId] = 0;
      return acc;
    }, {} as Record<string, number>);

    menu.forEach((item) => {
      const amountPerPerson = item.amount / item.peopleInvolved.length;
      item.peopleInvolved.forEach((personId) => {
        totals[personId] += amountPerPerson;
      });
    });

    return totals;
  };

  const owedAmounts = calculateOwedAmounts();

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Summary
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Who Paid the Bill?</InputLabel>
        <Select value={payer} onChange={handlePayerChange}>
          {Object.entries(people).map(([id, name]) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell>Amount</TableCell>
              {Object.entries(people).map(([id, name]) => (
                <TableCell key={id}>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {menu.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.amount.toFixed(2)}</TableCell>
                {Object.entries(people).map(([id, name]) => (
                  <TableCell key={id}>
                    {item.peopleInvolved.includes(id)
                      ? (item.amount / item.peopleInvolved.length).toFixed(2)
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
  );
};

export default Summary;