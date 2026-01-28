'use client'

import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, Box, Tooltip,
    IconButton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { completeProjectAction } from '@/app/actions/projectActions';
import { FutureProject } from '@/generated/client/client';

export default function CompleteProjectDialog({ project, homeId }: { project: FutureProject, homeId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        await completeProjectAction(formData);

        setLoading(false);
        setOpen(false);
    };

    return (
        <>
            <Tooltip title={"Mark as Completed"}>
                <IconButton onClick={() => setOpen(true)} color={"success"} size="small">
                    <CheckCircleOutlineIcon fontSize="medium" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <input type="hidden" name="homeId" value={homeId} />

                    <DialogTitle sx={{ fontWeight: 'bold' }}>Finalize Project</DialogTitle>

                    <DialogContent>
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'success.soft', borderRadius: 2, border: '1px solid', borderColor: 'success.light' }}>
                            <Typography variant="body2" color="success.main" fontWeight="500">
                                Great job! Finishing <strong>{project.title}</strong> adds real value to your home.
                            </Typography>
                        </Box>

                        <TextField
                            name="completedAt"
                            label="Date Completed"
                            type="date"
                            fullWidth
                            required
                            defaultValue={new Date().toISOString().split('T')[0]}
                            InputLabelProps={{ shrink: true }}
                            helperText="This will move the project to your completed history."
                        />
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            disabled={loading}
                            sx={{ fontWeight: 'bold' }}
                        >
                            {loading ? 'Processing...' : 'Finish Project'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}