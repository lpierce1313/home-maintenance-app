'use client'

import { useState } from 'react';
import {
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, Button, MenuItem, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateTaskAction } from '@/app/actions/taskActions';
import { CATEGORIES, CategoryType } from '@/lib/taskTemplates';
import { Task } from '@/generated/client/client';

export default function EditTaskDialog({ task, homeId }: { task: Task, homeId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Initialize state with current task values
  const [category, setCategory] = useState<CategoryType>((task.category || "General") as CategoryType);
  const [title, setTitle] = useState(task.title || "");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Force browser to check maxLength and required constraints
    if (!e.currentTarget.reportValidity()) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await updateTaskAction(formData);
      handleClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Edit Task">
        <IconButton size="small" onClick={handleOpen} color="inherit" sx={{ opacity: 0.7 }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{
        sx: { overflow: 'hidden' }
      }}>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="homeId" value={homeId} />

          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                name="title"
                label="Task Title"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputProps={{ maxLength: 60 }}
                helperText={`${title.length}/60`}
              />

              <TextField
                select
                name="category"
                label="Category"
                value={category}
                fullWidth
                onChange={(e) => setCategory(e.target.value as CategoryType)}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                name="frequency"
                label="Frequency"
                defaultValue={task.frequency}
                // Keeping read-only as per your business logic
                InputProps={{ readOnly: true }}
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
                inputProps={{ maxLength: 200 }}
                helperText="Max 200 characters"
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
              {loading ? 'Updating...' : 'Update Task'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}