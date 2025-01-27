import React, { useState } from 'react';
import {
  Box,
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
}

const MenuMain: React.FC<MenuMainProps> = ({ people }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [peopleInvolved, setPeopleInvolved] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [taxRate, setTaxRate] = useState<number>(10); // Example tax rate

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
    setEditingIndex(index);
    setName(item.name);
    setAmount(item.amount);
    setPeopleInvolved(item.peopleInvolved);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <MenuTable menu={menu} people={people} onEdit={handleEditItem} onDelete={handleDeleteItem} />
      <TaxBreakdown menu={menu} taxRate={taxRate} people={people} />
      <MenuForm onSubmit={handleAddOrEditItem} people={people} />
    </Box>
  );
};

export default MenuMain;
