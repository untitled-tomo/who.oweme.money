import React, { Dispatch, SetStateAction } from 'react';
import { Box, Paper, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface TaxBreakdownProps {
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
  taxRate: number;
  people: string[];
  setTaxRate : Dispatch<SetStateAction<number>>;
}

const TaxBreakdown: React.FC<TaxBreakdownProps> = ({ menu, taxRate, people ,setTaxRate}) => {
  const totals = people.reduce((acc, person) => {
    acc[person] = 0;
    return acc;
  }, {} as Record<string, number>);

  menu.forEach((item) => {
    const amountPerPerson = item.amount / item.peopleInvolved.length;
    item.peopleInvolved.forEach((person) => {
      totals[person] += amountPerPerson;
    });
  });

  return (
    <Box>
      <Box>
        <Typography>Tax percentage - {taxRate} %</Typography>
        <Slider
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
          onChange={
            (event, value) => {
              setTaxRate(value as number)
            }
          }
        />
      </Box>

    <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 4 }}>
      
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell sx={{fontWeight:'bold'}}> People </TableCell>
          <TableCell sx={{fontWeight:'bold'}}>Tax</TableCell>
          <TableCell sx={{fontWeight:'bold'}}>Total</TableCell>
          
        </TableRow>
      </TableHead>
      <TableBody>
        {people.map((person) => (
            <TableRow key={person} >
              <TableCell sx={{fontWeight:'bold'}}>{person}</TableCell>
              <TableCell>{((totals[person] * taxRate)/100).toFixed(2) }</TableCell>
              <TableCell>{totals[person].toFixed(2)}</TableCell>
            </TableRow>
          ))}
        {/* {menu.map((item, index) => (
          <TableRow key={index}>
            <TableCell sx={{position:'sticky',left:'0' , 'z-index':2 ,background:'white','white-space': 'nowrap', 'overflow': 'hidden' ,'text-overflow': 'ellipsis', 'max-width': '102px'}}>{item.name}</TableCell>
            <TableCell sx={{'z-index':1 }}>{item.amount.toFixed(2)}</TableCell>
            {people.map((person) => (
              <TableCell sx={{'z-index':1 }} key={person}>
                {item.peopleInvolved.includes(person)
                  ? (item.amount / item.peopleInvolved.length).toFixed(2)
                  : '-'}
              </TableCell>
            ))}
            
          </TableRow>
        ))} */}
      </TableBody>
    </Table>
  </TableContainer>
  </Box>

  );
};

export default TaxBreakdown;
