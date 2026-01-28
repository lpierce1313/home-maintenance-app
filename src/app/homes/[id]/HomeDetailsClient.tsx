// src/app/homes/[id]/HomeDetailsClient.tsx
"use client";

import { useState } from 'react';
import {
    Container, Typography, Stack, Button, Box, Divider,
    Chip, Paper, List, ListItem, ListItemText, ListItemIcon, Avatar,
    FormControl, InputLabel, Select, MenuItem
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
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Derive categories from data
    const categories = ["All", ...Array.from(new Set(home.tasks.map(t => t.category || "General")))];

    // Filter tasks
    const filteredTasks = selectedCategory === "All"
        ? home.tasks
        : home.tasks.filter(t => (t.category || "General") === selectedCategory);

    // Stats logic
    const totalTasks = home.tasks.length;
    const upToDateTasks = home.tasks.filter(t => new Date() <= new Date(t.dueDate)).length;
    const score = totalTasks > 0 ? Math.round((upToDateTasks / totalTasks) * 100) : 100;
    const totalInvested = home.tasks.reduce((acc, t) => acc + t.logs.reduce((sum, log) => sum + (log.cost || 0), 0), 0);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button startIcon={<ArrowBackIcon />} href="/" sx={{ mb: 4 }} color="inherit">Back</Button>

            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4" fontWeight="bold">{home.nickname}</Typography>
                        <EditHomeDialog home={home} />
                    </Stack>
                </Box>
                <ExportButton home={home} />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 4, mt: 2 }}>
                <Chip icon={<HealthAndSafetyIcon />} label={`Health: ${score}%`} variant="outlined" color="success" />
                <Chip icon={<AttachMoneyIcon />} label={`Invested: $${totalInvested}`} variant="outlined" />
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Maintenance Tasks</Typography>

                <Stack direction="row" spacing={2}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
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
                    <AddTaskDialog homeId={home.id} />
                </Stack>
            </Stack>

            <Paper variant="outlined" sx={{ borderRadius: 3 }}>
                <List>
                    {filteredTasks.map((task, index) => (
                        <Box key={task.id}>
                            <ListItem>
                                <ListItemIcon>
                                    <Avatar sx={{ bgcolor: 'success.light' }}><CheckCircleIcon /></Avatar>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography fontWeight="bold">{task.title}</Typography>
                                            <Chip label={task.category || 'General'} size="small" variant="outlined" />
                                        </Stack>
                                    }
                                    secondary={task.frequency}
                                />
                                <Stack direction="row" spacing={1}>
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
    );
}