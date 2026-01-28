'use client'

import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button, IconButton, Tooltip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteProjectAction } from '@/app/actions/projectActions';

export default function DeleteProjectDialog({ 
  projectId, 
  projectTitle, 
  homeId,
  onDeleteSuccess 
}: { 
  projectId: string; 
  projectTitle: string; 
  homeId: string;
  onDeleteSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("projectId", projectId);
    fd.append("homeId", homeId);
    
    try {
      await deleteProjectAction(fd);
      if (onDeleteSuccess) onDeleteSuccess();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Delete Project">
        <IconButton size="small" color="error" onClick={() => setOpen(true)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => !loading && setOpen(false)}>
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{projectTitle}</strong>? 
            This action cannot be undone and will remove it from your roadmap.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error" 
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}