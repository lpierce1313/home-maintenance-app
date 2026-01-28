'use client'

import { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateHomeAction } from '@/app/actions/homeActions';
import { Home } from '@/generated/client/client';

export default function EditHomeDialog({ home }: { home: Home }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!e.currentTarget.reportValidity()) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await updateHomeAction(formData);
      handleClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton size="small" onClick={() => setOpen(true)} sx={{ ml: 1 }}>
        <EditIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{
        sx: { overflow: 'hidden' }
      }}>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="homeId" value={home.id} />
          
          <DialogTitle>Edit Home Details</DialogTitle>
          
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                name="nickname" 
                label="Nickname" 
                defaultValue={home.nickname} 
                fullWidth 
                required 
                inputProps={{ maxLength: 50 }}
                helperText="Max 50 characters"
              />
              <TextField 
                name="address" 
                label="Address" 
                defaultValue={home.address} 
                fullWidth 
                inputProps={{ maxLength: 100 }}
                helperText="Max 100 characters"
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}