'use client';

import { useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, MenuItem, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { createTaskAction } from '@/app/actions/taskActions';
import { TASK_TEMPLATES } from '@/lib/taskTemplates';

export default function AddTaskDialog({ homeId }: { homeId: string }) {
  const [open, setOpen] = useState(false);

  // Local state for controlled inputs
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [description, setDescription] = useState('');
  const [lastDone, setLastDone] = useState('');

  const handleSelectTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const template = TASK_TEMPLATES.find(t => t.title === e.target.value);
    if (template) {
      setTitle(template.title);
      setFrequency(template.frequency);
      setDescription(template.description);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setFrequency('monthly');
    setDescription('');
    setLastDone('');
  };

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        Add Task
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs"  PaperProps={{
        sx: { overflow: 'hidden' }
      }}>
        <form action={async (formData) => {
          try {
            await createTaskAction(formData);
            handleClose();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            alert(err.message);
          }
        }}>
          <input type="hidden" name="homeId" value={homeId} />
          <DialogTitle>Add New Maintenance Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>

              {/* Template Picker */}
              <TextField
                select
                label="Quick Templates"
                defaultValue=""
                onChange={handleSelectTemplate}
                helperText="Pick a common task to autofill the form"
                InputProps={{
                  startAdornment: <AutoFixHighIcon color="primary" sx={{ mr: 1 }} />,
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  },
                }}
              >
                {TASK_TEMPLATES.map((t) => (
                  <MenuItem key={t.title} value={t.title}>
                    {t.title}
                  </MenuItem>
                ))}
              </TextField>

              <Divider>OR MANUALLY ENTER</Divider>

              <TextField
                name="title"
                label="Task Title"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <TextField
                select
                name="frequency"
                label="Frequency"
                fullWidth
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
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
                value={lastDone}
                onChange={(e) => setLastDone(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="description"
                label="Notes"
                multiline
                rows={2}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Add Task</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}