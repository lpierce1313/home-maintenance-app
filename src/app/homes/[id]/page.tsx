import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import {
  Container, Typography, Stack, Button, Box, Divider,
  Chip, Paper, List, ListItem, ListItemText, ListItemIcon, Avatar, Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildIcon from '@mui/icons-material/Build';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InsightsIcon from '@mui/icons-material/Insights';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

import AddTaskDialog from '@/components/AddTaskDialog';
import CompleteTaskDialog from '@/components/CompleteTaskDialog';
import DeleteTaskDialog from '@/components/DeleteTaskDialog';
import EditHomeDialog from '@/components/EditHomeDialog';
import EditTaskDialog from '@/components/EditTaskDialog';
import TaskHistoryDrawer from '@/components/TaskHistoryDrawer';
import ExportButton from "@/components/ExportPdfButton";
import { getHomeData } from "@/app/actions/homeActions";


export default async function HomeDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const homeId = params.id;
  const session = await auth();

  if (!session) redirect("/login");

  const home = await getHomeData(homeId, session.user?.id || '');

  if (!home) notFound();

  const totalTasks = home.tasks.length;
  const upToDateTasks = home.tasks.filter(t => new Date() <= new Date(t.dueDate)).length;
  const score = totalTasks > 0 ? Math.round((upToDateTasks / totalTasks) * 100) : 100;

  const totalInvested = home.tasks.reduce((acc, t) =>
    acc + t.logs.reduce((sum, log) => sum + (log.cost || 0), 0), 0);

  const projectedYearly = home.tasks.reduce((acc, t) => {
    const avg = t.logs.length > 0
      ? t.logs.reduce((s, l) => s + (l.cost || 0), 0) / t.logs.length
      : 50;
    const mult = t.frequency === 'monthly' ? 12 : t.frequency === 'quarterly' ? 4 : 1;
    return acc + (avg * mult);
  }, 0);

  const allUserProviders = await prisma.serviceProvider.findMany({
    where: { userId: session?.user?.id },
    orderBy: { name: 'asc' }
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* NAVIGATION */}
      <Button startIcon={<ArrowBackIcon />} href="/" sx={{ mb: 4 }} color="inherit">
        Back to Dashboard
      </Button>

      {/* HEADER SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4" fontWeight="bold">{home.nickname}</Typography>
            <EditHomeDialog home={home} />
          </Stack>
          <Typography color="text.secondary">{home.address || 'No address set'}</Typography>
        </Box>
        <ExportButton home={home} />
      </Stack>

      {/* STATS CHIP ROW */}
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 4, mt: 2, gap: 1 }}>
        <Chip
          icon={<HealthAndSafetyIcon />}
          label={`Health: ${score}%`}
          variant="outlined"
          color={score > 80 ? "success" : score > 50 ? "warning" : "error"}
          sx={{ fontWeight: 'bold' }}
        />
        <Chip
          icon={<InsightsIcon />}
          label={`Annual Est: $${projectedYearly.toFixed(0)}`}
          variant="outlined"
        />
        <Chip
          icon={<AttachMoneyIcon />}
          label={`Invested: $${totalInvested.toLocaleString()}`}
          variant="outlined"
        />
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Maintenance Tasks</Typography>
        <AddTaskDialog homeId={homeId} />
      </Stack>

      {/* TASK LIST SECTION */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List disablePadding>
          {home.tasks.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                No maintenance tasks found for this home.
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Add your first task like &quot;Change HVAC Filter&quot; or &quot;Clean Gutters&quot; to get started.
              </Typography>
            </Box>
          ) : (
            home.tasks.map((task, index) => {
              const today = new Date();
              const dueDate = task.dueDate ? new Date(task.dueDate) : new Date();
              const isPastDue = today > dueDate;
              const diffDays = Math.ceil(Math.abs(today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));

              let statusLabel = "";
              let statusColor: "success" | "warning" | "error" = "success";
              let StatusIcon = CheckCircleIcon;

              if (isPastDue) {
                if (diffDays <= 14) {
                  statusLabel = "Attention";
                  statusColor = "warning";
                  StatusIcon = BuildIcon;
                } else if (diffDays <= 30) {
                  statusLabel = "Due Now";
                  statusColor = "warning";
                  StatusIcon = BuildIcon;
                } else {
                  statusLabel = diffDays > 60 ? "Neglected" : "Overdue";
                  statusColor = "error";
                  StatusIcon = ReportProblemIcon;
                }
              }

              return (
                <Box key={task.id}>
                  <ListItem sx={{ py: 2.5 }}>
                    <ListItemIcon sx={{ minWidth: 56 }}>
                      <Tooltip title={statusLabel || "Current"}>
                        <Avatar
                          sx={{
                            bgcolor: isPastDue ? `${statusColor}.light` : 'transparent',
                            color: isPastDue ? `${statusColor}.main` : 'success.main',
                            border: isPastDue ? 'none' : '1px solid',
                            borderColor: 'success.light',
                            width: 42,
                            height: 42
                          }}
                        >
                          <StatusIcon fontSize="small" />
                        </Avatar>
                      </Tooltip>
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {task.title}
                          </Typography>
                          {statusLabel && (
                            <Chip
                              label={statusLabel}
                              color={statusColor}
                              size="small"
                              sx={{ height: 18, fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }}
                            />
                          )}
                        </Stack>
                      }
                      secondary={
                        <Box component="div" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {task.frequency} - {task.description || 'No notes'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: isPastDue ? 'bold' : 'medium',
                              color: isPastDue ? 'error.main' : 'text.primary'
                            }}
                          >
                            {isPastDue ? 'Was due: ' : 'Next due: '}
                            {dueDate.toLocaleDateString()}
                            {isPastDue && ` (${diffDays} days past)`}
                          </Typography>
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />

                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CompleteTaskDialog
                        task={task}
                        homeId={homeId}
                        existingProviders={allUserProviders}
                      />
                      <TaskHistoryDrawer task={task} />
                      <EditTaskDialog task={task} homeId={homeId} />
                      <DeleteTaskDialog taskId={task.id} homeId={homeId} />
                    </Stack>
                  </ListItem>
                  {index < home.tasks.length - 1 && <Divider component="li" />}
                </Box>
              );
            })
          )}
        </List>
      </Paper>
    </Container>
  );
}