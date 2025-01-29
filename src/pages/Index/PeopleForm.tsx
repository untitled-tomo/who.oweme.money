import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Box, TextField, Typography, Grid, InputAdornment } from '@mui/material';

interface PeopleFormProps {
  setNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  ref?: React.Ref<{ validate: () => boolean }>;
}

const PeopleForm = forwardRef<{ validate: () => boolean }, PeopleFormProps>(
  ({ setNames }, ref) => {
    const [numPeople, setNumPeople] = useState(3);
    const [localNames, setLocalNames] = useState<Record<string, string>>({
      p_1: 'Ram',
      p_2: 'Sam',
      p_3: 'Pam',
    });

    const handleNumPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Math.max(0, parseInt(e.target.value, 10) || 0); // Avoid negative numbers
      setNumPeople(num);
      const newNames: Record<string, string> = {};
      for (let i = 1; i <= num; i++) {
        newNames[`p_${i}`] = localNames[`p_${i}`] || '';
      }
      setLocalNames(newNames);
    };

    const handleNameChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newNames = { ...localNames, [id]: e.target.value };
      setLocalNames(newNames);
    };

    // Validation Function
    const validate = () => {
      if (numPeople < 2) return false; // Minimum 2 people required
      if (Object.values(localNames).some((name) => name.trim() === '')) return false; // No empty names allowed
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
          {Object.keys(localNames).map((id, index) => (
            <Grid item xs={12} sm={6} key={id}>
              <TextField
                label={`Friend ${index + 1}`}
                value={localNames[id]}
                onChange={(e) => handleNameChange(id, e)}
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