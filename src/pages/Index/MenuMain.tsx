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
  people: Record<string, string>;
  menu: MenuItem[];
  setMenu?: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  taxRate: number;
  isSummary?:Boolean;
  setTaxRate?: React.Dispatch<React.SetStateAction<number>>;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  onAdd?: () => void;
}

const MenuMain: React.FC<MenuMainProps> = ({ people,isSummary=false ,menu, setMenu, taxRate, setTaxRate, onEdit, onDelete, onAdd}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }} mb={1}>
      <MenuTable menu={menu} people={people} onEdit={onEdit} onDelete={onDelete}  isSummary={isSummary} />
      <TaxBreakdown menu={menu} taxRate={taxRate} people={people} setTaxRate={setTaxRate} isSummary={isSummary}/>
      {!isSummary && <Button variant="contained" color="primary" onClick={onAdd}>
        Add Menu Item
      </Button>}
    </Box>
  );
};

export default MenuMain;
