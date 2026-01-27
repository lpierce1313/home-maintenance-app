'use client'

import { useState } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createHomeAction } from '@/app/actions/homeActions';

export default function AddHomeDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async (formData: FormData) => {
    setLoading(true);
    await createHomeAction(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={() => setOpen(true)}
      >
        Add Home
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <form action={handleAction}>
          <DialogTitle>Add New Home</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                name="nickname"
                label="Home Nickname"
                placeholder="e.g. My Apartment"
                fullWidth
                required
              />
              <TextField
                name="address"
                label="Address (Optional)"
                placeholder="123 Main St"
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Home'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}