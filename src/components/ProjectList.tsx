'use client'

import {
    Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon,
    Stack, Divider, Chip,
    IconButton
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { reorderProjectAction } from '@/app/actions/projectActions';
import EditProjectDialog from './EditProjectDialog';
import DeleteProjectDialog from './DeleteProjectDialog';
import { FutureProject } from '@/generated/client/client';
import CompleteProjectDialog from './CompleteProjectDialog';

const PRIORITY_COLORS: Record<string, "info" | "success" | "warning" | "error"> = {
    LOW: "info",
    MEDIUM: "success",
    HIGH: "warning",
    URGENT: "error"
};

export default function ProjectList({ projects, homeId }: { projects: FutureProject[], homeId: string }) {
    return (
        <Paper variant="outlined" sx={{ borderRadius: 3 }}>
            <List>
                {projects.map((project, index) => (
                    <Box key={project.id}>
                        <ListItem>
                            <ListItemIcon sx={{ minWidth: 50 }}>
                                {/* Ranking Controls built into the Icon area */}
                                <Stack alignItems="center">
                                    <IconButton
                                        size="small"
                                        disabled={index === 0}
                                        onClick={() => reorderProjectAction(project.id, 'up')}
                                        sx={{ p: 0 }}
                                    >
                                        <KeyboardArrowUpIcon fontSize="small" />
                                    </IconButton>
                                    <Typography variant="caption" fontWeight="bold">{index + 1}</Typography>
                                    <IconButton
                                        size="small"
                                        disabled={index === projects.length - 1}
                                        onClick={() => reorderProjectAction(project.id, 'down')}
                                        sx={{ p: 0 }}
                                    >
                                        <KeyboardArrowDownIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </ListItemIcon>

                            <ListItemText
                                primary={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography fontWeight="bold">{project.title}</Typography>
                                        <Chip
                                            label={project.priority}
                                            size="small"
                                            variant="outlined"
                                            color={PRIORITY_COLORS[project.priority]}
                                            sx={{ fontSize: '0.65rem', height: 20 }}
                                        />
                                    </Stack>
                                }
                                secondary={
                                    project.estimatedCost
                                        ? `Estimated Investment: $${project.estimatedCost.toLocaleString()}`
                                        : 'No cost estimate set'
                                }
                            />

                            <Stack direction="row" spacing={1}>
                                <CompleteProjectDialog project={project} homeId={homeId} />
                                <EditProjectDialog project={project} homeId={homeId} />
                                <DeleteProjectDialog
                                    projectId={project.id}
                                    projectTitle={project.title}
                                    homeId={homeId}
                                />
                            </Stack>
                        </ListItem>
                        {index < projects.length - 1 && <Divider />}
                    </Box>
                ))}
            </List>
        </Paper>
    );
}