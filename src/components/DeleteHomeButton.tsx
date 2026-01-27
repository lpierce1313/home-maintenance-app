'use client'

import { useState } from 'react';
import { 
  IconButton, Dialog, DialogTitle, DialogContent, 
  DialogContentText, DialogActions, Button 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteHomeAction } from '@/app/actions/homeActions';

export default function DeleteHomeButton({ homeId, homeName }: { homeId: string, homeName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteHomeAction(homeId);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <IconButton 
        size="small" 
        color="error" 
        onClick={() => setOpen(true)}
        sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete &quot;{homeName}&quot;?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove this home and all its maintenance tasks. 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error" 
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Home'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}