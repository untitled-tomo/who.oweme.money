import React from 'react';
import { Box, Typography } from '@mui/material';

interface TaxBreakdownProps {
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
  taxRate: number;
  people: string[];
}

const TaxBreakdown: React.FC<TaxBreakdownProps> = ({ menu, taxRate, people }) => {
  const totals = people.reduce((acc, person) => {
    acc[person] = 0;
    return acc;
  }, {} as Record<string, number>);

  menu.forEach((item) => {
    const taxAmount = (item.amount * taxRate) / 100;
    const amountPerPerson = taxAmount / item.peopleInvolved.length;
    item.peopleInvolved.forEach((person) => {
      totals[person] += amountPerPerson;
    });
  });

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Tax Breakdown ({taxRate}%)
      </Typography>
      {people.map((person) => (
        <Typography key={person}>
          {person}: {totals[person].toFixed(2)}
        </Typography>
      ))}
    </Box>
  );
};

export default TaxBreakdown;
