import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Box, TextField, Typography, Grid, InputAdornment } from '@mui/material';

interface PeopleFormProps {
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
  ref?: React.Ref<{ validate: () => boolean }>;
}

const PeopleForm = forwardRef<{ validate: () => boolean }, PeopleFormProps>(
  ({ setNames }, ref) => {
    const [numPeople, setNumPeople] = useState(3);
    const [localNames, setLocalNames] = useState<string[]>(['Ram', 'Sam', 'Pam']);

    const handleNumPeopleChange = (e: React.ChangeEvent<HTMLInputElement >) => {
      const num = Math.max(0, parseInt(e.target.value, 10) || 0); // Avoid negative numbers
      setNumPeople(num);
      setLocalNames(Array(num).fill(''));
    };

    const handleNameChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newNames = [...localNames];
      newNames[index] = e.target.value;
      setLocalNames(newNames);
    };

    // Validation Function
    const validate = () => {
      if (numPeople < 2) return false; // Minimum 2 people required
      if (localNames.some((name) => name.trim() === '')) return false; // No empty names allowed
      setNames(localNames); // Set names if valid
      return true;
    };

    // Expose the `validate` function to the parent using `useImperativeHandle`
    useImperativeHandle(ref, () => ({
      validate,
    }));

    return (
      <Box sx={{ maxWidth: 500, margin: '0 auto', p: 2 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Enter Your Friends' Names
        </Typography>

        <TextField
          type="number"
          label="Number of People"
          value={numPeople}
          onChange={handleNumPeopleChange}
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">👥</InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          {localNames.map((name, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                label={`Friend ${index + 1}`}
                value={name}
                onChange={(e) => handleNameChange(index, e)}
                fullWidth
                variant="outlined"
                placeholder="Enter name"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
);

export default PeopleForm;
