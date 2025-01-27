import React, { useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Checkbox,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem as MuiMenuItem,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import MenuTable from '@/components/Menu/MenuTable';
import MenuForm from '@/components/Menu/MenuForm';
import TaxBreakdown from '@/components/Menu/TaxBreakdown';

interface MenuItem {
  name: string;
  amount: number;
  peopleInvolved: string[];
}

interface MenuMainProps {
  people: string[];
}

const MenuMain: React.FC<MenuMainProps> = ({ people }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [peopleInvolved, setPeopleInvolved] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleCheckboxChange = (person: string) => {
    setPeopleInvolved((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person]
    );
  };

  const resetForm = () => {
    setName('');
    setAmount('');
    setPeopleInvolved([]);
    setEditingIndex(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === '' || parseFloat(amount as string) <= 0 || peopleInvolved.length === 0) {
      alert('Please fill in all fields with valid data.');
      return;
    }

    const newItem: MenuItem = { name, amount: parseFloat(amount as string), peopleInvolved };

    if (editingIndex !== null) {
      setMenu((prevMenu) => {
        const updatedMenu = [...prevMenu];
        updatedMenu[editingIndex] = newItem;
        return updatedMenu;
      });
    } else {
      setMenu((prevMenu) => [...prevMenu, newItem]);
    }

    resetForm();
  };


  const handleAddOrEditItem = (name: string, amount: number, peopleInvolved: string[]) => {
    setMenu((prevMenu) => [...prevMenu, { name, amount, peopleInvolved }]);
  };


  const handleDeleteItem = (index: number) => {
    setMenu((prevMenu) => prevMenu.filter((_, i) => i !== index));
  };

  const confirmDelete = () => {
    setMenu((prevMenu) => prevMenu.filter((_, i) => i !== itemToDelete));
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };


  const handleEditItem = (index: number) => {
    const item = menu[index];
    // Implement editing logic here
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <MenuTable menu={menu} people={people} onEdit={handleEditItem} onDelete={handleDeleteItem} />
      <MenuForm onSubmit={handleAddOrEditItem} people={people} />
      {/* <TaxBreakdown menu={menu} taxRate={taxRate} people={people} /> */}
    </Box>
  );
};

export default MenuMain;


//     <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
    //   {/* Responsive Table */}
    //   <Box sx={{ flex: 1, overflowX: 'auto' }}>
    //     <Typography variant="h5" gutterBottom>
    //       Menu Items
    //     </Typography>
    //     <TableContainer component={Paper}>
    //       <Table>
    //         <TableHead>
    //           <TableRow>
    //             <TableCell>Menu Item</TableCell>
    //             <TableCell>Amount</TableCell>
    //             {people.map((person) => (
    //               <TableCell key={person}>{person}</TableCell>
    //             ))}
    //             <TableCell>Actions</TableCell>
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {menu.map((item, index) => (
    //             <TableRow key={index}>
    //               <TableCell>{item.name}</TableCell>
    //               <TableCell>{item.amount.toFixed(2)}</TableCell>
    //               {people.map((person) => (
    //                 <TableCell key={person}>
    //                   {item.peopleInvolved.includes(person) ? (
    //                     (item.amount / item.peopleInvolved.length).toFixed(2)
    //                   ) : (
    //                     '-'
    //                   )}
    //                 </TableCell>
    //               ))}
    //               <TableCell>
    //                 <IconButton onClick={() => handleEdit(index)} aria-label="edit">
    //                   <Edit />
    //                 </IconButton>
    //                 <IconButton
    //                   onClick={() => handleDelete(index)}
    //                   aria-label="delete"
    //                   color="error"
    //                 >
    //                   <Delete />
    //                 </IconButton>
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   </Box>

    //   {/* Form */}
    //   <Box sx={{ flex: 1 }}>
    //     <Typography variant="h5" gutterBottom>
    //       {editingIndex !== null ? 'Edit Menu Item' : 'Add Menu Item'}
    //     </Typography>
    //     <form onSubmit={handleSubmit}>
    //       <TextField
    //         label="Menu Item Name"
    //         variant="outlined"
    //         fullWidth
    //         value={name}
    //         onChange={handleNameChange}
    //         sx={{ mb: 2 }}
    //       />
    //       <TextField
    //         label="Amount"
    //         type="number"
    //         variant="outlined"
    //         fullWidth
    //         value={amount}
    //         onChange={handleAmountChange}
    //         sx={{ mb: 2 }}
    //       />
    //       <Select
    //         multiple
    //         displayEmpty
    //         value={peopleInvolved}
    //         onChange={(e) =>
    //           setPeopleInvolved(
    //             typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
    //           )
    //         }
    //         fullWidth
    //         renderValue={(selected) =>
    //           selected.length === 0 ? 'Select People' : selected.join(', ')
    //         }
    //         sx={{ mb: 2 }}
    //       >
    //         {people.map((person) => (
    //           <MuiMenuItem key={person} value={person}>
    //             <Checkbox checked={peopleInvolved.includes(person)} />
    //             {person}
    //           </MuiMenuItem>
    //         ))}
    //       </Select>
    //       <Button type="submit" variant="contained" color="primary" fullWidth>
    //         {editingIndex !== null ? 'Save Changes' : 'Add Menu Item'}
    //       </Button>
    //     </form>
    //   </Box>

    //   {/* Delete Confirmation Dialog */}
    //   <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
    //     <DialogTitle>Delete Menu Item</DialogTitle>
    //     <DialogContent>
    //       Are you sure you want to delete this menu item? This action cannot be undone.
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
    //       <Button onClick={confirmDelete} color="error">
    //         Delete
    //       </Button>
    //     </DialogActions>
    //   </Dialog>
    // </Box>