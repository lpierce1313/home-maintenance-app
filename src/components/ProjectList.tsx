'use client'

import {
    Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon,
    Stack, Divider, Chip,
    IconButton, useMediaQuery, useTheme
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

export default function ProjectList({ projects, homeId, existingNames }: { projects: FutureProject[], homeId: string, existingNames: string[] }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, width: '100%', overflow: 'hidden' }}>
            <List disablePadding>
                {projects.map((project, index) => (
                    <Box key={project.id} sx={{ width: '100%' }}>
                        <ListItem
                            sx={{
                                py: 2,
                                px: { xs: 1, sm: 2 },
                                flexDirection: isMobile ? 'column' : 'row',
                                alignItems: isMobile ? 'flex-start' : 'center',
                                gap: isMobile ? 1 : 0
                            }}
                        >
                            <Stack direction="row" spacing={1} sx={{ width: '100%', minWidth: 0 }}>
                                {/* 1. Ranking Area - Compact for mobile */}
                                <ListItemIcon sx={{ minWidth: { xs: 35, sm: 50 }, mr: 1 }}>
                                    <Stack alignItems="center" sx={{ bgcolor: 'action.hover', borderRadius: 1, py: 0.5 }}>
                                        <IconButton
                                            size="small"
                                            disabled={index === 0}
                                            onClick={() => reorderProjectAction(project.id, 'up')}
                                            sx={{ p: 0 }}
                                        >
                                            <KeyboardArrowUpIcon fontSize="small" />
                                        </IconButton>
                                        <Typography variant="caption" fontWeight="bold" sx={{ lineHeight: 1 }}>
                                            {index + 1}
                                        </Typography>
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

                                {/* 2. Text Info Area - Forced to not push width */}
                                <ListItemText
                                    disableTypography
                                    sx={{ m: 0, minWidth: 0, flexGrow: 1 }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', mb: 0.5, gap: 1 }}>
                                        <Typography fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                                            {project.title}
                                        </Typography>
                                        <Chip
                                            label={project.priority}
                                            size="small"
                                            variant="outlined"
                                            color={PRIORITY_COLORS[project.priority]}
                                            sx={{ fontSize: '0.6rem', height: 18 }}
                                        />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {project.estimatedCost
                                            ? `Est. Invest: $${project.estimatedCost.toLocaleString()}`
                                            : 'No cost set'}
                                    </Typography>
                                    {project.assignedTo && (
                                        <>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                {project.assignedTo}
                                            </Typography>
                                        </>
                                    )}

                                </ListItemText>

                            </Stack>

                            {/* 3. Actions Area - Full width on mobile for better tapping */}
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    mt: isMobile ? 2 : 0,
                                    width: isMobile ? '100%' : 'auto',
                                    justifyContent: isMobile ? 'space-between' : 'flex-end',
                                    pl: isMobile ? { xs: 5.5, sm: 0 } : 0 // Align buttons under text, not under numbers
                                }}
                            >
                                <CompleteProjectDialog project={project} homeId={homeId} />
                                <EditProjectDialog project={project} homeId={homeId} existingNames={existingNames} />
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