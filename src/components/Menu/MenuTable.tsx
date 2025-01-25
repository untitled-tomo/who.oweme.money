import React from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { red } from '@mui/material/colors';

interface MenuTableProps {
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
  people: string[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({ menu, people, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 4 , bgcolor: 'red',}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>Amount</TableCell>
            {people.map((person) => (
              <TableCell key={person}>{person}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menu.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.amount.toFixed(2)}</TableCell>
              {people.map((person) => (
                <TableCell key={person}>
                  {item.peopleInvolved.includes(person)
                    ? (item.amount / item.peopleInvolved.length).toFixed(2)
                    : '-'}
                </TableCell>
              ))}
              <TableCell>
                <IconButton onClick={() => onEdit(index)} aria-label="edit">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(index)} aria-label="delete" color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MenuTable;
