'use client';

import { useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, MenuItem, Divider,
  useMediaQuery, useTheme, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { createTaskAction } from '@/app/actions/taskActions';
import { CATEGORIES, CategoryType, TASK_TEMPLATES } from '@/lib/taskTemplates';

export default function AddTaskDialog({ homeId, fullWidth }: { homeId: string, fullWidth?: boolean }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Local state for controlled inputs
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>(CATEGORIES[0]);
  const [lastDone, setLastDone] = useState('');

  const handleSelectTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const template = TASK_TEMPLATES.find(t => t.title === e.target.value);
    if (template) {
      setTitle(template.title);
      setFrequency(template.frequency);
      setCategory(template.category);
      setDescription(template.description);
    }
  };

  const handleSelectCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value as CategoryType);
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
      <Button
        // Use the prop passed by parent, but default to isMobile logic
        fullWidth={fullWidth ?? isMobile}
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          whiteSpace: 'nowrap',
          textTransform: 'none',
          fontWeight: 'bold',
          borderRadius: 2,
          // Prevent vertical stretching on desktop header
          height: { sm: '40px' }
        }}
      >
        Add Task
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            overflow: 'hidden',
            borderRadius: 3
          }
        }}
      >
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
          <DialogTitle sx={{ fontWeight: 'bold' }}>New Maintenance Task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>

              <TextField
                select
                label="Quick Templates"
                defaultValue=""
                onChange={handleSelectTemplate}
                helperText="Pick a common task to autofill"
                InputProps={{
                  startAdornment: <AutoFixHighIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />,
                }}
                SelectProps={{
                  MenuProps: { PaperProps: { style: { maxHeight: 300 } } },
                }}
              >
                {TASK_TEMPLATES.map((t) => (
                  <MenuItem key={t.title} value={t.title}>{t.title}</MenuItem>
                ))}
              </TextField>

              <Divider>
                <Box component="span" sx={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'text.secondary', px: 1 }}>
                  OR MANUALLY ENTER
                </Box>
              </Divider>

              <TextField
                name="title"
                label="Task Title"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputProps={{ maxLength: 60 }}
              // Removing helperText count here to save vertical height on small mobile screens
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  name="category"
                  label="Category"
                  value={category}
                  fullWidth
                  onChange={handleSelectCategory}
                >
                  {CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>

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
              </Stack>

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
                inputProps={{ maxLength: 200 }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 'bold' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ fontWeight: 'bold' }}>Add Task</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}