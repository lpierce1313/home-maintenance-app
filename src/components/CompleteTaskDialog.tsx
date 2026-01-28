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
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [comment, setComment] = useState("");
  const [workerType, setWorkerType] = useState<'self' | 'company'>('self');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | string | null>(null);

  const today = new Date();
  const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
  const isPastDue = today > dueDate;
  const isNeglected = isPastDue && Math.ceil(Math.abs(today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)) > 30;

  const handleClose = () => {
    setOpen(false);
    setFileUrl("");
    setComment("");
    setSelectedProvider(null);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validates: email format, phone pattern, and required fields
    if (!e.currentTarget.reportValidity()) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    formData.append("workerType", workerType);
    formData.append("fileUrl", fileUrl);

    if (workerType === 'company') {
      if (typeof selectedProvider === 'string') {
        formData.append("companyName", selectedProvider);
      } else if (selectedProvider) {
        formData.append("providerId", selectedProvider.id);
        formData.append("companyName", selectedProvider.name);
      }
    }

    try {
      await completeTaskAction(formData);
      handleClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { overflow: 'hidden' } }}>
        <form onSubmit={handleSubmit} noValidate={false}>
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="homeId" value={homeId} />

          <DialogTitle sx={{ pb: 1, color: isPastDue ? 'error.main' : 'inherit' }}>
            {isPastDue ? "Log Late Maintenance" : "Log Maintenance"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
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
                  <ToggleButton value="self"><PersonIcon sx={{ mr: 1, fontSize: 18 }} /> DIY</ToggleButton>
                  <ToggleButton value="company"><BusinessIcon sx={{ mr: 1, fontSize: 18 }} /> Pro</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {workerType === 'company' && (
                <Stack spacing={2}>
                  <Autocomplete
                    freeSolo
                    options={existingProviders}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                    onChange={(_, val) => setSelectedProvider(val)}
                    onInputChange={(_, val) => (typeof selectedProvider === 'string' || selectedProvider === null) && setSelectedProvider(val)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Provider Name"
                        required
                        inputProps={{ ...params.inputProps, maxLength: 50 }}
                      />
                    )}
                  />

                  {typeof selectedProvider === 'string' && selectedProvider.length > 0 && (
                    <Stack spacing={2} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                      <Typography variant="caption" fontWeight="bold" color="primary">NEW PROVIDER DETAILS</Typography>
                      <TextField
                        name="providerPhone"
                        label="Phone (Optional)"
                        type="tel"
                        fullWidth
                        inputProps={{
                          maxLength: 20,
                          // Regex: Allows optional +, then digits, spaces, dots, or dashes. 
                          // Ensures it doesn't just pass with a single dash.
                          pattern: "[+]?[0-9\\s\\-\\.\\(\\)]{7,20}"
                        }}
                        helperText="Min 7 digits (e.g. 123-456-7890)"
                      />
                      <TextField
                        name="providerEmail"
                        label="Email (Optional)"
                        type="email"
                        fullWidth
                        inputProps={{
                          maxLength: 100,
                          pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                        }}
                        helperText="Must be a valid email format"
                      />
                    </Stack>
                  )}
                </Stack>
              )}

              <TextField
                name="cost"
                label="Total Cost"
                type="number"
                inputProps={{ step: "0.01", max: 999999 }}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                fullWidth
              />

              <TextField
                name="comment"
                label="Notes/Comments"
                multiline
                rows={2}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                inputProps={{ maxLength: 150 }}
                helperText={`${comment.length}/150`}
              />

              <Box>
                <CldUploadWidget
                  uploadPreset="maintenance_uploads"
                  onSuccess={(res) => res.info && typeof res.info !== 'string' && setFileUrl(res.info.secure_url)}
                  options={{ sources: ['local', 'camera'], resourceType: 'auto' }}
                >
                  {({ open }) => (
                    <Button
                      fullWidth variant="outlined" onClick={() => open()}
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
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading} color={isPastDue ? "error" : "success"}>
              {loading ? 'Saving...' : 'Complete & Log'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}