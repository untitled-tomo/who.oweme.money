import React, { useState, useRef } from 'react';
import { Button, Stepper, Step, StepLabel, Alert, Box, Typography } from '@mui/material';
import PeopleForm from './PeopleForm';
import MenuMain from './MenuMain';
interface MenuItem {
  name: string;
  amount: number;
  peopleInvolved: string[];
}

const Index: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const steps = ['People', 'Menu', 'Summary'];

  // Ref for PeopleForm
  const peopleFormRef = useRef<{ validate: () => boolean } | null>(null);

  const next = () => {
    if (current === 0) {
      // Validate PeopleForm
      const isValid = peopleFormRef.current?.validate();
      if (!isValid) {
        setAlertMessage('Please ensure you have entered at least 2 people with valid names.');
        return;
      }
    }
    setAlertMessage(null);
    setCurrent((prev) => prev + 1);
  };

  const prev = () => setCurrent((prev) => prev - 1);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [taxRate, setTaxRate] = useState<number>(10); // Example tax rate

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      // overflow: 'auto', 
      maxWidth: '90vw'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 ,  width: '100%', }}>
        <Stepper activeStep={current}sx={{
            alignItems: 'center',
            width: '100%', maxWidth: 600
            
          }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        
        </Stepper>
      </Box>
      {alertMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {alertMessage}
        </Alert>
      )}


      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {current === 0 && (
          <PeopleForm ref={peopleFormRef} setNames={setNames} />
        )}
        {current === 1 && <MenuMain people={names} menu={menu} setMenu={setMenu} taxRate={taxRate} setTaxRate={setTaxRate} />}
        {current === 2 && (
          <Typography variant="h6">Summary content here.</Typography>
        )}
      </Box>

      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
        }}>
        {current > 0 && (
          <Button variant="outlined" onClick={prev} sx={{ mr: 2 }}>
            Previous
          </Button>
        )}
        {current < steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={next}>
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => alert('All steps complete!')}
          >
            Done
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default Index;