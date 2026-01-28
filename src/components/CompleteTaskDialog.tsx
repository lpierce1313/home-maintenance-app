'use client'

import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, InputAdornment,
  IconButton, Tooltip, Button, Box, Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { completeTaskAction } from '@/app/actions/taskActions';
import { Task } from '@/generated/client/client';

export default function CompleteTaskDialog({ task, homeId }: { task: Task, homeId: string }) {
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState(""); // State to store the uploaded file URL

  const today = new Date();
  const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
  const isPastDue = today > dueDate;
  const diffDays = Math.ceil(Math.abs(today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));

  const isNeglected = isPastDue && diffDays > 30;

  // Detect file type for UI feedback
  const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== 'string') {
      setFileUrl(result.info.secure_url);
    }
  };
  return (
    <>
      <Tooltip title={isPastDue ? "Resolve Overdue Task" : "Mark as Done"}>
        <IconButton
          onClick={() => setOpen(true)}
          color={isPastDue ? "error" : "success"}
          size="small"
        >
          {isPastDue ? (
            <AssignmentLateIcon fontSize="medium" sx={{ animation: isNeglected ? 'pulse 2s infinite' : 'none' }} />
          ) : (
            <CheckCircleIcon fontSize="medium" />
          )}
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <form action={async (formData) => {
          await completeTaskAction(formData);
          setOpen(false);
          setFileUrl(""); // Reset file state after submission
        }}>
          {/* ID Fields */}
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="homeId" value={homeId} />

          {/* Cloudinary URL Hidden Input */}
          <input type="hidden" name="fileUrl" value={fileUrl} />

          <DialogTitle sx={{ pb: 0, color: isPastDue ? 'error.main' : 'inherit' }}>
            {isPastDue ? "Log Late Maintenance" : "Log Maintenance"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                name="performedBy"
                label="Who did the work?"
                placeholder="Self, Plumber, etc."
                fullWidth
              />
              <TextField
                name="cost"
                label="Total Cost"
                type="number"
                inputProps={{ step: "0.01" }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                fullWidth
              />
              <TextField
                name="comment"
                label="Notes/Comments"
                multiline
                rows={3}
                fullWidth
              />

              {/* Cloudinary Upload Widget */}
              <Box sx={{ mt: 1 }}>
                <CldUploadWidget
                  uploadPreset="maintenance_uploads" // Ensure this matches your Cloudinary preset
                  onSuccess={handleUploadSuccess}
                  options={{
                    sources: ['local', 'camera'],
                    multiple: false,
                    resourceType: 'auto', // Important for PDF + Image support
                    clientAllowedFormats: ['png', 'jpeg', 'jpg', 'pdf']
                  }}
                >
                  {({ open }) => (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => open()}
                      color={fileUrl ? "success" : "primary"}
                      startIcon={fileUrl ? (isPdf ? <PictureAsPdfIcon /> : <ImageIcon />) : <CloudUploadIcon />}
                      sx={{
                        py: 1.5,
                        borderStyle: fileUrl ? 'solid' : 'dashed',
                        textTransform: 'none'
                      }}
                    >
                      {fileUrl ? "Document Attached ✓" : "Attach Receipt or Photo"}
                    </Button>
                  )}
                </CldUploadWidget>
                {fileUrl && (
                  <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5, textAlign: 'center' }}>
                    File ready to save with log.
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color={isPastDue ? "error" : "success"}
            >
              {isPastDue ? "Complete Overdue Task" : "Complete & Log"}
            </Button>
          </DialogActions>
        </form>

        <style jsx global>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}</style>
      </Dialog>
    </>
  );
}