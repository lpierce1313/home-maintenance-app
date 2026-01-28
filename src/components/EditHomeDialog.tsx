'use client'

import { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateHomeAction } from '@/app/actions/homeActions';
import { Home } from '@prisma/client';

export default function EditHomeDialog({ home }: { home: Home }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton size="small" onClick={() => setOpen(true)} sx={{ ml: 1 }}>
        <EditIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <form action={async (formData) => {
          await updateHomeAction(formData);
          setOpen(false);
        }}>
          <input type="hidden" name="homeId" value={home.id} />
          <DialogTitle>Edit Home Details</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField name="nickname" label="Nickname" defaultValue={home.nickname} fullWidth required />
              <TextField name="address" label="Address" defaultValue={home.address} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}