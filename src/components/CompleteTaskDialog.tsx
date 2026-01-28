'use client'

import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Stack, InputAdornment,
  IconButton, Tooltip, Button, Box, Typography,
  ToggleButton, ToggleButtonGroup, Autocomplete
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { completeTaskAction } from '@/app/actions/taskActions';
import { Task } from '@/generated/client/client';

interface ServiceProvider {
  id: string;
  name: string;
}

export default function CompleteTaskDialog({
  task,
  homeId,
  existingProviders = []
}: {
  task: Task,
  homeId: string,
  existingProviders: ServiceProvider[]
}) {
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [workerType, setWorkerType] = useState<'self' | 'company'>('self');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | string | null>(null);

  const today = new Date();
  const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
  const isPastDue = today > dueDate;
  const diffDays = Math.ceil(Math.abs(today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
  const isNeglected = isPastDue && diffDays > 30;

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result.info && typeof result.info !== 'string') {
      setFileUrl(result.info.secure_url);
    }
  };

  return (
    <>
      <Tooltip title={isPastDue ? "Resolve Overdue Task" : "Mark as Done"}>
        <IconButton onClick={() => setOpen(true)} color={isPastDue ? "error" : "success"} size="small">
          {isPastDue ? (
            <AssignmentLateIcon fontSize="medium" sx={{ animation: isNeglected ? 'pulse 2s infinite' : 'none' }} />
          ) : (
            <CheckCircleIcon fontSize="medium" />
          )}
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{
        sx: { overflow: 'hidden' }
      }}>
        <form action={async (formData) => {
          // Manually append state that isn't a native input
          formData.append("workerType", workerType);

          if (workerType === 'company') {
            if (typeof selectedProvider === 'string') {
              formData.append("companyName", selectedProvider); // New Provider
            } else if (selectedProvider) {
              formData.append("providerId", selectedProvider.id); // Existing Provider
              formData.append("companyName", selectedProvider.name);
            }
          }

          await completeTaskAction(formData);
          setOpen(false);
          setFileUrl("");
          setSelectedProvider(null);
        }}>
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="homeId" value={homeId} />
          <input type="hidden" name="fileUrl" value={fileUrl} />

          <DialogTitle sx={{ pb: 1, color: isPastDue ? 'error.main' : 'inherit' }}>
            {isPastDue ? "Log Late Maintenance" : "Log Maintenance"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>

              {/* Toggle for Self vs Professional */}
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                  Who performed this task?
                </Typography>
                <ToggleButtonGroup
                  value={workerType}
                  exclusive
                  onChange={(_, val) => val && setWorkerType(val)}
                  fullWidth
                  size="small"
                  color="primary"
                >
                  <ToggleButton value="self">
                    <PersonIcon sx={{ mr: 1, fontSize: 18 }} /> DIY / Self
                  </ToggleButton>
                  <ToggleButton value="company">
                    <BusinessIcon sx={{ mr: 1, fontSize: 18 }} /> Professional
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Conditional Provider Selection */}
              {workerType === 'company' && (
                <Stack spacing={2}>
                  <Autocomplete
                    freeSolo
                    options={existingProviders}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                    onChange={(_, val) => setSelectedProvider(val)}
                    onInputChange={(_, val) => {
                      // If user is typing a new name, update the selection
                      if (typeof selectedProvider === 'string' || selectedProvider === null) {
                        setSelectedProvider(val);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Provider Name" required placeholder="Search or add new..." />
                    )}
                  />

                  {/* Show contact fields only for brand new providers */}
                  {typeof selectedProvider === 'string' && selectedProvider.length > 0 && (
                    <Stack spacing={2} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                      <Typography variant="caption" fontWeight="bold" color="primary">NEW PROVIDER DETAILS</Typography>
                      <TextField name="providerPhone" label="Phone (Optional)" size="small" fullWidth />
                      <TextField name="providerEmail" label="Email (Optional)" size="small" fullWidth />
                    </Stack>
                  )}
                </Stack>
              )}

              <TextField
                name="cost"
                label="Total Cost"
                type="number"
                inputProps={{ step: "0.01" }}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                fullWidth
              />

              <TextField name="comment" label="Notes/Comments" multiline rows={2} fullWidth />

              <Box>
                <CldUploadWidget
                  uploadPreset="maintenance_uploads"
                  onSuccess={handleUploadSuccess}
                  options={{ sources: ['local', 'camera'], resourceType: 'auto' }}
                >
                  {({ open }) => (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => open()}
                      color={fileUrl ? "success" : "primary"}
                      startIcon={fileUrl ? (fileUrl.endsWith('.pdf') ? <PictureAsPdfIcon /> : <ImageIcon />) : <CloudUploadIcon />}
                      sx={{ py: 1.2, borderStyle: fileUrl ? 'solid' : 'dashed', textTransform: 'none' }}
                    >
                      {fileUrl ? "Document Attached ✓" : "Attach Receipt or Photo"}
                    </Button>
                  )}
                </CldUploadWidget>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color={isPastDue ? "error" : "success"}>
              Complete & Log
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}