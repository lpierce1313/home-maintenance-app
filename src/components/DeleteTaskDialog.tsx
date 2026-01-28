'use client'

import { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTaskAction } from '@/app/actions/taskActions';

export default function DeleteTaskDialog({ taskId, homeId }: { taskId: string, homeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Delete Task">
        <IconButton size="small" color="error" onClick={() => setOpen(true)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Task?</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure? This will delete the task and its history.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => deleteTaskAction(taskId, homeId)} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}