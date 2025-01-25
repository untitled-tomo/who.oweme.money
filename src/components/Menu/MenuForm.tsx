import React, { useState } from 'react';
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
} from '@mui/material';

interface MenuFormProps {
  onSubmit: (name: string, amount: number, peopleInvolved: string[]) => void;
  people: string[];
}

const MenuForm: React.FC<MenuFormProps> = ({ onSubmit, people }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [peopleInvolved, setPeopleInvolved] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || parseFloat(amount as string) <= 0 || peopleInvolved.length === 0) {
      alert('Please fill in all fields.');
      return;
    }
    onSubmit(name, parseFloat(amount as string), peopleInvolved);
    setName('');
    setAmount('');
    setPeopleInvolved([]);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
      <Typography variant="h6" mb={2}>
        Add Menu Item
      </Typography>
      <TextField
        label="Item Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Amount"
        variant="outlined"
        type="number"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select People</InputLabel>
        <Select
          multiple
          value={peopleInvolved}
          onChange={(e) => setPeopleInvolved(e.target.value as string[])}
          input={<OutlinedInput label="Select People" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {people.map((person) => (
            <MenuItem key={person} value={person}>
              <Checkbox checked={peopleInvolved.includes(person)} />
              {person}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Save
      </Button>
    </Box>
  );
};

export default MenuForm;
