'use client'

import { useState } from 'react';
import {
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Button, MenuItem, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateTaskAction } from '@/app/actions/taskActions';
import { Task } from '@/generated/client/client';

export default function EditTaskDialog({ task, homeId }: { task: Task, homeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Edit Task">
        <IconButton size="small" onClick={() => setOpen(true)} color="inherit" sx={{ opacity: 0.7 }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs"  PaperProps={{
        sx: { overflow: 'hidden' }
      }}>
        <form action={async (formData) => {
          await updateTaskAction(formData);
          setOpen(false);
        }}>
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="homeId" value={homeId} />

          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                name="title"
                label="Task Title"
                defaultValue={task.title}
                required
                fullWidth
              />
              <TextField
                select
                name="frequency"
                label="Frequency"
                defaultValue={task.frequency}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="annually">Annually</MenuItem>
              </TextField>
              <TextField
                name="description"
                label="Description"
                defaultValue={task.description}
                multiline
                rows={2}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Update Task</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}