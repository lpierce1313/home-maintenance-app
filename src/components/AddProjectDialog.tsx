'use client'

import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, MenuItem, Stack 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { addProjectAction } from '@/app/actions/projectActions';

export default function AddProjectDialog({ homeId }: { homeId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addProjectAction(formData);
    
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="contained" 
        color="secondary" 
        startIcon={<AddIcon />} 
        onClick={() => setOpen(true)}
        sx={{ borderRadius: 2, fontWeight: 'bold' }}
      >
        Add Project
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="homeId" value={homeId} />
          <DialogTitle>New Improvement Project</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                name="title" 
                label="Project Title" 
                fullWidth 
                required 
                inputProps={{ maxLength: 60 }} 
                placeholder="e.g. Paint Kitchen Cabinets"
              />
              <TextField 
                select 
                name="priority" 
                label="Priority" 
                defaultValue="MEDIUM" 
                fullWidth
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </TextField>
              <TextField 
                name="estimatedCost" 
                label="Estimated Cost" 
                type="number" 
                fullWidth 
                InputProps={{ startAdornment: '$' }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="secondary" disabled={loading}>
              {loading ? 'Adding...' : 'Add to Roadmap'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}