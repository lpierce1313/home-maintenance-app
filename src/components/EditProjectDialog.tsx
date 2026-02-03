'use client'

import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, MenuItem, Stack, IconButton, Tooltip,
  Autocomplete
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateProjectAction, deleteProjectAction } from '@/app/actions/projectActions';
import { FutureProject } from '@/generated/client/client';

// Update props to include existingNames
interface EditProjectDialogProps {
  project: FutureProject;
  homeId: string;
  existingNames: string[];
}

export default function EditProjectDialog({ project, homeId, existingNames }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Track assignedTo state for the Autocomplete
  const [assignedTo, setAssignedTo] = useState(project.assignedTo || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    // Ensure the Autocomplete value is included in the FormData
    formData.set('assignedTo', assignedTo);
    
    await updateProjectAction(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Edit Project">
        <IconButton size="small" onClick={() => setOpen(true)} sx={{ opacity: 0.7 }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="homeId" value={homeId} />
          
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Edit Project
            <IconButton 
              color="error" 
              size="small"
              onClick={async () => {
                if(confirm("Are you sure you want to delete this project?")) {
                  const fd = new FormData();
                  fd.append("projectId", project.id);
                  fd.append("homeId", homeId);
                  await deleteProjectAction(fd);
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField 
                name="title" 
                label="Project Title" 
                defaultValue={project.title}
                fullWidth 
                required 
                inputProps={{ maxLength: 60 }} 
              />
              
              {/* Autocomplete for Assigned To */}
              <Autocomplete
                freeSolo
                options={existingNames}
                value={assignedTo}
                onInputChange={(event, newValue) => setAssignedTo(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    name="assignedTo"
                    label="Assigned To" 
                    placeholder="e.g. Luke Pierce"
                    fullWidth
                  />
                )}
              />

              <TextField 
                select 
                name="priority" 
                label="Priority" 
                defaultValue={project.priority}
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
                defaultValue={project.estimatedCost}
                fullWidth 
                InputProps={{ startAdornment: '$' }}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="secondary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}