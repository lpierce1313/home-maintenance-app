'use client'

import { useState } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Stack, useMediaQuery, useTheme 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createHomeAction } from '@/app/actions/homeActions';

export default function AddHomeDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Detect screen size
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        // Only take full width on mobile; on desktop, stay natural size
        fullWidth={isMobile}
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          // Ensure it doesn't stretch vertically on desktop
          height: { sm: '40px' } 
        }}
      >
        Add Home
      </Button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullWidth 
        maxWidth="xs" 
        PaperProps={{ sx: { overflow: 'hidden' } }}
      >
        <form action={handleAction}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Home</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                name="nickname"
                label="Home Nickname"
                placeholder="e.g. My Apartment"
                fullWidth
                required
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                name="address"
                label="Address (Optional)"
                placeholder="123 Main St"
                fullWidth
                inputProps={{ maxLength: 100 }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ fontWeight: 'bold' }}
            >
              {loading ? 'Saving...' : 'Save Home'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}