import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Container, Typography, Stack, Box,
  Breadcrumbs, Paper, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar
} from '@mui/material';
import Link from 'next/link';
import ConstructionIcon from '@mui/icons-material/Construction';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ProjectList from "@/components/ProjectList";
import AddProjectDialog from "@/components/AddProjectDialog";
import DeleteProjectDialog from "@/components/DeleteProjectDialog";

export default async function HomeProjectsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  if (!id) notFound();

  const home = await prisma.home.findUnique({
    where: { id },
    include: {
      futureProjects: {
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!home) notFound();

  // Logic: Split projects by status
  const plannedProjects = home.futureProjects.filter(p => p.status !== 'COMPLETED');
  const completedProjects = home.futureProjects.filter(p => p.status === 'COMPLETED');

  // Stats Calculations
  const totalPlannedBudget = plannedProjects.reduce((acc, p) => acc + (p.estimatedCost || 0), 0);
  const totalCompletedInvestment = completedProjects.reduce((acc, p) => acc + (p.estimatedCost || 0), 0);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Navigation Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
            >
              Dashboard
            </Typography>
          </Link>

          <Link href={`/homes/${id}`} style={{ textDecoration: 'none' }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
            >
              {home.nickname}
            </Typography>
          </Link>

          <Typography variant="body2" color="text.primary">Improvements</Typography>
        </Breadcrumbs>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Improvements Roadmap
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Plan and track value-adding projects for {home.nickname}.
            </Typography>
          </Box>
          <AddProjectDialog homeId={id} />
        </Stack>
      </Box>

      {/* Summary Statistics - Mimicking Home Style */}
      <Paper variant="outlined" sx={{ p: 3, mb: 6, bgcolor: 'action.hover', borderRadius: 4 }}>
        <Stack direction="row" spacing={6} divider={<Divider orientation="vertical" flexItem />}>
          <Box>
            <Typography variant="caption" fontWeight="bold" color="secondary.main" display="block" sx={{ mb: 0.5 }}>
              PLANNED PROJECTS
            </Typography>
            <Typography variant="h5" fontWeight="bold">{plannedProjects.length}</Typography>
            <Typography variant="caption" color="text.secondary">
              Est. ${totalPlannedBudget.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" fontWeight="bold" color="success.main" display="block" sx={{ mb: 0.5 }}>
              LIFETIME IMPROVEMENTS
            </Typography>
            <Typography variant="h5" fontWeight="bold">{completedProjects.length}</Typography>
            <Typography variant="caption" color="text.secondary">
              Invested: ${totalCompletedInvestment.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* SECTION 1: ACTIVE ROADMAP */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConstructionIcon color="secondary" /> Active Roadmap
        </Typography>
        
        {plannedProjects.length > 0 ? (
          <ProjectList homeId={home.id} projects={plannedProjects} />
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, border: '2px dashed', borderColor: 'divider', borderRadius: 4 }}>
            <Typography variant="body1" color="text.secondary">No active projects planned.</Typography>
          </Box>
        )}
      </Box>

      {/* SECTION 2: COMPLETED PROJECTS */}
      {completedProjects.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" /> Completed Improvements
          </Typography>
          
          <Paper variant="outlined" sx={{ borderRadius: 3, bgcolor: 'background.paper' }}>
            <List disablePadding>
              {completedProjects.map((project, index) => (
                <Box key={project.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <CheckCircleIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography component="span" fontWeight="bold">{project.title}</Typography>}
                      secondary={
                        <Typography component="span" variant="body2" color="text.secondary">
                          Completed on {project.completedAt ? new Date(project.completedAt).toLocaleDateString() : 'N/A'} • ${project.estimatedCost?.toLocaleString() || '0'}
                        </Typography>
                      }
                    />
                    <DeleteProjectDialog 
                      projectId={project.id} 
                      projectTitle={project.title} 
                      homeId={id} 
                    />
                  </ListItem>
                  {index < completedProjects.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Box>
      )}
    </Container>
  );
}