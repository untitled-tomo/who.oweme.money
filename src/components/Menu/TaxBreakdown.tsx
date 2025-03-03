import React, { Dispatch, SetStateAction } from 'react';
import { Box, Paper, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface TaxBreakdownProps {
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
  taxRate: number;
  isSummary:Boolean;
  people: Record<string, string>;
  setTaxRate?: Dispatch<SetStateAction<number>>;
}

const TaxBreakdown: React.FC<TaxBreakdownProps> = ({ isSummary=false, menu, taxRate, people, setTaxRate }) => {
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

  return (
    <Box>
      <Box mb={isSummary ? 2: 0}>
        <Typography>Tax percentage - {taxRate} %</Typography>
        {!isSummary && <Slider
          size="small"
          value={taxRate}
          aria-label="Small"
          valueLabelDisplay="auto"
          onChange={(event, value) => {
            if (typeof value === 'number') {
              setTaxRate && setTaxRate(value);
            }
          }}
        />}
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>People</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Menu Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tax</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(people).map(([id, name]) => (
              <TableRow key={id}>
                <TableCell sx={{ fontWeight: 'bold' }}>{name}</TableCell>
                <TableCell>{totals[id].toFixed(2)}</TableCell>
                <TableCell>{((totals[id] * taxRate) / 100).toFixed(2)}</TableCell>
                <TableCell>{Number(((totals[id] * taxRate) / 100).toFixed(2)) + Number(totals[id].toFixed(2))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaxBreakdown;