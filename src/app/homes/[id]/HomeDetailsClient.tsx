// src/app/homes/[id]/HomeDetailsClient.tsx
"use client";

import { useState } from 'react';
import {
    Container, Typography, Stack, Button, Box, Divider,
    Chip, Paper, List, ListItem, ListItemText, ListItemIcon, Avatar,
    FormControl, InputLabel, Select, MenuItem, useMediaQuery, useTheme,
    GlobalStyles
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FilterListIcon from '@mui/icons-material/FilterList';

import AddTaskDialog from '@/components/AddTaskDialog';
import CompleteTaskDialog from '@/components/CompleteTaskDialog';
import DeleteTaskDialog from '@/components/DeleteTaskDialog';
import EditHomeDialog from '@/components/EditHomeDialog';
import EditTaskDialog from '@/components/EditTaskDialog';
import TaskHistoryDrawer from '@/components/TaskHistoryDrawer';
import ExportButton from "@/components/ExportPdfButton";
import { HomeWithTasksAndLogs } from '@/lib/types';
import { ServiceProvider } from '@/generated/client/client';

interface Props {
    home: HomeWithTasksAndLogs;
    allUserProviders: ServiceProvider[];
}

export default function HomeDetailsClient({ home, allUserProviders }: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", ...Array.from(new Set(home.tasks.map(t => t.category || "General")))];

    const filteredTasks = selectedCategory === "All"
        ? home.tasks
        : home.tasks.filter(t => (t.category || "General") === selectedCategory).sort((a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );

    const totalTasks = filteredTasks.length;
    const now = new Date();
    const upToDateTasks = filteredTasks.filter(t => now <= new Date(t.dueDate)).length;
    const score = totalTasks > 0 ? Math.round((upToDateTasks / totalTasks) * 100) : 100;
    const totalInvested = filteredTasks.reduce((acc, t) => acc + t.logs.reduce((sum, log) => sum + (log.cost || 0), 0), 0);

    return (
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
            {/* Kill horizontal scroll at the root level */}
            <GlobalStyles styles={{ 
                body: { overflowX: 'hidden', width: '100%' },
                html: { overflowX: 'hidden' } 
            }} />

            <Container 
                maxWidth="md" 
                disableGutters={isMobile}
                sx={{ 
                    py: isMobile ? 2 : 4, 
                    px: isMobile ? 2 : 3,
                    boxSizing: 'border-box'
                }}
            >
                {/* Navigation */}
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    href="/" 
                    sx={{ mb: 4, textTransform: 'none' }} 
                    color="inherit"
                    fullWidth={isMobile}
                >
                    Back to Homes
                </Button>

                {/* Header: Title + Export */}
                <Stack 
                    direction={isMobile ? "column" : "row"} 
                    spacing={2} 
                    justifyContent="space-between" 
                    alignItems={isMobile ? "stretch" : "center"}
                    sx={{ mb: 2, width: '100%' }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                        <Typography 
                            variant={isMobile ? "h5" : "h4"} 
                            fontWeight="bold" 
                            sx={{ wordBreak: 'break-word' }}
                        >
                            {home.nickname}
                        </Typography>
                        <EditHomeDialog home={home} />
                    </Stack>
                    <ExportButton home={home} fullWidth={isMobile} />
                </Stack>

                {/* Stats */}
                <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                    <Chip icon={<HealthAndSafetyIcon />} label={`Health: ${score}%`} variant="outlined" color="success" />
                    <Chip icon={<AttachMoneyIcon />} label={`Invested: $${totalInvested}`} variant="outlined" />
                </Stack>

                {/* Action Bar */}
                <Stack 
                    direction={isMobile ? "column" : "row"} 
                    spacing={2} 
                    sx={{ mb: 3, width: '100%' }}
                >
                    <FormControl size="small" sx={{ flexGrow: 1, width: '100%' }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            label="Category"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            startAdornment={<FilterListIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <AddTaskDialog homeId={home.id} fullWidth={isMobile} />
                </Stack>

                {/* Task List */}
                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', width: '100%' }}>
                    <List disablePadding>
                        {filteredTasks.map((task, index) => (
                            <Box key={task.id} sx={{ width: '100%' }}>
                                <ListItem 
                                    sx={{ 
                                        py: 2, 
                                        px: isMobile ? 2 : 3, 
                                        flexDirection: isMobile ? 'column' : 'row', 
                                        alignItems: isMobile ? 'flex-start' : 'center',
                                        width: '100%',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    {/* Task Info Area */}
                                    <Stack 
                                        direction="row" 
                                        spacing={2} 
                                        sx={{ width: '100%', minWidth: 0, flexGrow: 1 }}
                                    >
                                        {!isMobile && (
                                            <ListItemIcon sx={{ minWidth: 'auto' }}>
                                                <Avatar sx={{ bgcolor: 'success.light' }}><CheckCircleIcon /></Avatar>
                                            </ListItemIcon>
                                        )}
                                        
                                        <ListItemText
                                            disableTypography // FIXES HYDRATION ERROR
                                            sx={{ m: 0, minWidth: 0 }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', mb: 0.5 }}>
                                                <Typography fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
                                                    {task.title}
                                                </Typography>
                                                <Chip label={task.category || 'General'} size="small" variant="outlined" />
                                            </Stack>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                                    {task.frequency}
                                                </Typography>
                                                <Typography variant="caption" color="error.main" sx={{ fontWeight: 'bold', display: 'block' }}>
                                                    Next Due: {new Date(task.dueDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </ListItemText>
                                    </Stack>

                                    {/* Action Buttons Area */}
                                    <Stack 
                                        direction="row" 
                                        spacing={1} 
                                        sx={{ 
                                            mt: isMobile ? 2 : 0, 
                                            width: isMobile ? '100%' : 'auto',
                                            justifyContent: isMobile ? 'space-between' : 'flex-end',
                                            flexShrink: 0 // Prevents buttons from squishing
                                        }}
                                    >
                                        <CompleteTaskDialog task={task} homeId={home.id} existingProviders={allUserProviders} />
                                        <TaskHistoryDrawer task={task} />
                                        <EditTaskDialog task={task} homeId={home.id} />
                                        <DeleteTaskDialog taskId={task.id} homeId={home.id} />
                                    </Stack>
                                </ListItem>
                                {index < filteredTasks.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
}