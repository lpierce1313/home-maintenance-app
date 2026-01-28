'use client'

import { useState } from 'react';
import {
  Drawer, Box, Typography, IconButton, Stack,
  Divider, List, ListItem, ListItemText, Tooltip,
  Button
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PaymentsIcon from '@mui/icons-material/Payments';
import { MaintenanceLog, Task } from '@/generated/client/client';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// Define the type to include the joined logs
type TaskWithLogs = Task & {
  logs: MaintenanceLog[];
};

export default function TaskHistoryDrawer({ task }: { task: TaskWithLogs }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="View History">
        <IconButton size="small" sx={{
          color: task.logs.length > 0 ? 'primary.main' : 'grey.500'
        }} disabled={task.logs.length === 0} onClick={() => setOpen(true)}>
          <HistoryIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, p: 3 } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Maintenance History</Typography>
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </Stack>

        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          {task.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
          Cycle: {task.frequency}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {task.logs.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5 }}>
            <HistoryIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography>No history found.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {task.logs.map((log, index) => {
              const isPdf = log.fileUrl?.toLowerCase().endsWith('.pdf');
              return (
                <Box key={log.id}>
                  <ListItem disablePadding sx={{ py: 2, alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight="bold">
                          {new Date(log.completedAt).toLocaleDateString()}
                        </Typography>
                      }
                      secondary={
                        <Box component="div" sx={{ mt: 0.5 }}>
                          <Stack spacing={1}>
                            {log.comment && (
                              <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
                                &quot;{log.comment}&quot;
                              </Typography>
                            )}
                            <Stack direction="row" spacing={2}>
                              {log.performedBy && (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <PersonIcon sx={{ fontSize: 14 }} />
                                  <Typography variant="caption">{log.performedBy}</Typography>
                                </Stack>
                              )}
                              {log.cost ? (
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <PaymentsIcon sx={{ fontSize: 14, color: 'success.main' }} />
                                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                    ${log.cost.toFixed(2)}
                                  </Typography>
                                </Stack>
                              ) : null}
                              {log.fileUrl && (
                                <Box sx={{ mt: 1.5 }}>
                                  {isPdf ? (
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<PictureAsPdfIcon />}
                                      href={log.fileUrl}
                                      target="_blank"
                                      fullWidth
                                      sx={{ textTransform: 'none', color: 'error.main', borderColor: 'error.light' }}
                                    >
                                      View Receipt (PDF)
                                    </Button>
                                  ) : (
                                    <Box
                                      component="img"
                                      src={log.fileUrl}
                                      sx={{ width: '100%', borderRadius: 2, cursor: 'pointer' }}
                                      onClick={() => window.open(log.fileUrl!, '_blank')}
                                    />
                                  )}
                                </Box>
                              )}
                            </Stack>
                          </Stack>
                        </Box>
                      }
                      // This is the critical line to fix the HTML nesting error:
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                  {index < task.logs.length - 1 && <Divider />}
                </Box>
              )
            })}
          </List>
        )}
      </Drawer>
    </>
  );
}