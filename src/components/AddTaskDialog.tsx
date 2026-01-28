'use client'

import { useState } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Stack, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createTaskAction } from '@/app/actions/taskActions';

export default function AddTaskDialog({ homeId }: { homeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add Task
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <form action={async (formData) => {
          await createTaskAction(formData);
          setOpen(false);
        }}>
          <input type="hidden" name="homeId" value={homeId} />
          <DialogTitle>Add New Maintenance Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField name="title" label="Task Title" placeholder="e.g. Air Filter" required fullWidth />
              
              <TextField
                select
                name="frequency"
                label="Frequency"
                defaultValue="monthly"
                fullWidth
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annually">Annually</MenuItem>
              </TextField>

              <TextField
                name="lastDone"
                label="Last Replaced / Done (Optional)"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                helperText="If empty, we'll assume it's due starting from today."
              />

              <TextField name="description" label="Notes" multiline rows={2} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Task</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}