import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
} from '@mui/material';

interface MenuFormProps {
  onSubmit: (name: string, cost: number, quantity: number, peopleInvolved: string[]) => void;
  people: Record<string, string>;
  editingItem?: { name: string; amount: number; quantity?: number; peopleInvolved: string[] } | null;
}

const MenuForm: React.FC<MenuFormProps> = ({ onSubmit, people, editingItem }) => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState<number | string>('');
  const [quantity, setQuantity] = useState<number | string>(1);
  const [peopleInvolved, setPeopleInvolved] = useState<string[]>([]);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      // Handle backward compatibility with existing items that may not have quantity
      const itemCost = editingItem.quantity ? editingItem.amount / editingItem.quantity : editingItem.amount;
      setCost(itemCost);
      setQuantity(editingItem.quantity || 1);
      setPeopleInvolved(editingItem.peopleInvolved);
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || 
        parseFloat(cost as string) <= 0 || 
        parseInt(quantity as string) <= 0 || 
        peopleInvolved.length === 0) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    
    onSubmit(
      name, 
      parseFloat(cost as string), 
      parseInt(quantity as string), 
      peopleInvolved
    );
    
    setName('');
    setCost('');
    setQuantity(1);
    setPeopleInvolved([]);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, mx: 'auto', mb: 4 }}>
      <Typography variant="h6" mb={2}>
        {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
      </Typography>
      <TextField
        label="Item Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Cost Per Item"
            variant="outlined"
            type="number"
            fullWidth
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            inputProps={{ min: 0, step: "0.01" }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Quantity"
            variant="outlined"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
          />
        </Grid>
      </Grid>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select People</InputLabel>
        <Select
          multiple
          value={peopleInvolved}
          onChange={(e) => setPeopleInvolved(e.target.value as string[])}
          input={<OutlinedInput label="Select People" />}
          renderValue={(selected) => {
            return selected.map(id => people[id]).join(', ');
          }}
        >
          {Object.entries(people).map(([id, name]) => (
            <MenuItem key={id} value={id}>
              <Checkbox checked={peopleInvolved.includes(id)} />
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {editingItem ? 'Update' : 'Save'}
      </Button>
    </Box>
  );
};

export default MenuForm;