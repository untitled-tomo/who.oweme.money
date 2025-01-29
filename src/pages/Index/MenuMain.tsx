import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
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
  menu : MenuItem[];
  setMenu : Dispatch<SetStateAction<MenuItem[]>>;
  taxRate : number;
  setTaxRate : Dispatch<SetStateAction<number>>;
}

const MenuMain: React.FC<MenuMainProps> = ({ people , menu , setMenu , taxRate, setTaxRate}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleAddOrEditItem = (name: string, amount: number, peopleInvolved: string[]) => {
    const newItem: MenuItem = { name, amount, peopleInvolved };

    if (editingIndex !== null) {
      setMenu((prevMenu) => {
        const updatedMenu = [...prevMenu];
        updatedMenu[editingIndex] = newItem;
        return updatedMenu;
      });
      setEditingIndex(null);
      setEditingItem(null);
    } else {
      setMenu((prevMenu) => [...prevMenu, newItem]);
    }
    setDialogOpen(false);
  };

  const handleDeleteItem = (index: number) => {
    setItemToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setMenu((prevMenu) => prevMenu.filter((_, i) => i !== itemToDelete));
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleEditItem = (index: number) => {
    const item = menu[index];
    setEditingIndex(index);
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setEditingIndex(null);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <MenuTable menu={menu} people={people} onEdit={handleEditItem} onDelete={handleDeleteItem} />
      <TaxBreakdown menu={menu} taxRate={taxRate} people={people} setTaxRate={setTaxRate} />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
          <MenuForm onSubmit={handleAddOrEditItem} people={people} editingItem={editingItem} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Menu Item</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this menu item? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Button variant="contained" color="primary" onClick={handleAddItem}>
        Add Menu Item
      </Button>
    </Box>
  );
};

export default MenuMain;
