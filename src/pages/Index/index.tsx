import React, { useState, useRef } from 'react';
import { Button, Stepper, Step, StepLabel, Alert, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PeopleForm from './PeopleForm';
import MenuMain from './MenuMain';
import Summary from './Summary';
import MenuForm from '@/components/Menu/MenuForm';
import SEO from '../../components/SEO';

interface MenuItem {
  name: string;
  amount: number;
  quantity: number;
  peopleInvolved: string[];
}

const Index: React.FC = () => {
  const [names, setNames] = useState<Record<string, string>>({});
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [current, setCurrent] = useState(0);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [taxRate, setTaxRate] = useState<number>(10); // Example tax rate
  const [confirmNavigationOpen, setConfirmNavigationOpen] = useState(false);
  const steps = ['People', 'Menu', 'Summary'];

  // Ref for PeopleForm
  const peopleFormRef = useRef<{ validate: () => boolean } | null>(null);

  const resetState = () => {
    setMenu([]);
    setTaxRate(10);
    setEditingItem(null);
    setEditingIndex(null);
    setDialogOpen(false);
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setAlertMessage(null);
  };

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

  const prev = () => {
    if (current === 1 && menu.length > 0) {
      setConfirmNavigationOpen(true);
    } else {
      handlePrevConfirm();
    }
  };

  const handlePrevConfirm = () => {
    setCurrent((prev) => prev - 1);
    if (current === 1) {
      resetState();
    }
    setConfirmNavigationOpen(false);
  };

  const handlePrevCancel = () => {
    setConfirmNavigationOpen(false);
  };

  const handleAddOrEditItem = (name: string, cost: number, quantity: number, peopleInvolved: string[]) => {
    // Calculate total amount based on cost and quantity
    const amount = cost * quantity;
    const newItem: MenuItem = { name, amount, quantity, peopleInvolved };

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
    <>
      <SEO 
        title="Split Your Bill - Who Owe Me Money" 
        description="Calculate and track who owes you money for shared expenses. Simple, fast bill splitting for friends and groups."
        type="website"
      />
      
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'auto', 
        maxWidth: '90vw'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 ,  width: '100%', }}>
          <Stepper activeStep={current}sx={{ alignItems: 'center', width: '100%', maxWidth: 600 }}>
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
          {current === 1 && (
            <MenuMain 
              people={names}
              menu={menu}
              setMenu={setMenu}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onAdd={handleAddItem}
            />)}
          {current === 2 && (
            <Summary 
              people={names} 
              menu={menu} 
              taxRate={taxRate} 
              onPrevious={() => setCurrent(1)}
              onDone={() => {
                // Reset to initial step when done
                setCurrent(0);
                setMenu([]);
                setNames({});
                setTaxRate(10);
                setAlertMessage(null);
              }}
            />
          )}
        </Box>

        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
          }}>
          {current > 0 && current < steps.length - 1 && (
            <Button variant="outlined" onClick={prev} sx={{ mr: 2 }}>
              Previous
            </Button>
          )}
          {current < steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={next}>
              Next
            </Button>
          ) : null}
        </Box>

          {/* Add/Edit Dialog */}
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          {/* <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle> */}
          <DialogContent>
            <MenuForm onSubmit={handleAddOrEditItem} people={names} editingItem={editingItem} />
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

        {/* Navigation Confirmation Dialog */}
        <Dialog
          open={confirmNavigationOpen}
          onClose={handlePrevCancel}
        >
          <DialogTitle>Confirm Navigation</DialogTitle>
          <DialogContent>
            Are you sure you want to go back? Your menu progress will be lost.
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePrevCancel}>Cancel</Button>
            <Button onClick={handlePrevConfirm} color="error">
              Go Back
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
export default Index;