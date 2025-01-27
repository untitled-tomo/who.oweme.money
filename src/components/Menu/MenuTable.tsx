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

interface MenuTableProps {
  menu: { name: string; amount: number; peopleInvolved: string[] }[];
  people: string[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({ menu, people, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto', mb: 4 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{fontWeight:'bold', position:'sticky',left:'0' , 'z-index':2,'white-space': 'nowrap', 'overflow': 'hidden' ,'text-overflow': 'ellipsis', 'max-width': '110px' }}>Item Name</TableCell>
            <TableCell sx={{'z-index':1,fontWeight:'bold', }}>Amount</TableCell>
            {people.map((person) => (
              <TableCell key={person} sx={{fontWeight:'bold','z-index':1 ,'white-space': 'nowrap', 'overflow': 'hidden' ,'text-overflow': 'ellipsis', 'max-width': '102px'}}>{person}</TableCell>
            ))}
            <TableCell sx={{fontWeight:'bold','z-index':1 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menu.map((item, index) => (
            <TableRow key={index}>
              <TableCell sx={{fontWeight:'bold',position:'sticky',left:'0' , 'z-index':2 ,background:'white','white-space': 'nowrap', 'overflow': 'hidden' ,'text-overflow': 'ellipsis', 'max-width': '102px'}}>{item.name}</TableCell>
              <TableCell sx={{'z-index':1 }}>{item.amount.toFixed(2)}</TableCell>
              {people.map((person) => (
                <TableCell sx={{'z-index':1 }} key={person}>
                  {item.peopleInvolved.includes(person)
                    ? (item.amount / item.peopleInvolved.length).toFixed(2)
                    : '-'}
                </TableCell>
              ))}
              <TableCell sx={{ 'z-index':1 ,display:'flex' }}>
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
