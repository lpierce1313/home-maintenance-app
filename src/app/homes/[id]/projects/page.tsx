// src/app/homes/[id]/projects/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Container, Typography, Stack, Box,
  Breadcrumbs, Paper, Divider, List, ListItem, ListItemIcon, ListItemText, Avatar, GlobalStyles
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

  const plannedProjects = home.futureProjects.filter(p => p.status !== 'COMPLETED');
  const completedProjects = home.futureProjects.filter(p => p.status === 'COMPLETED');

  const totalPlannedBudget = plannedProjects.reduce((acc, p) => acc + (p.estimatedCost || 0), 0);
  const totalCompletedInvestment = completedProjects.reduce((acc, p) => acc + (p.estimatedCost || 0), 0);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <GlobalStyles styles={{ 
        body: { overflowX: 'hidden', width: '100%' },
        '*': { boxSizing: 'border-box' } 
      }} />

      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* Navigation Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs sx={{ mb: 2, '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap', overflow: 'hidden' } }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>Dashboard</Typography>
            </Link>
            <Link href={`/homes/${id}`} style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>{home.nickname}</Typography>
            </Link>
            <Typography variant="caption" color="text.primary" sx={{ whiteSpace: 'nowrap' }}>Improvements</Typography>
          </Breadcrumbs>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
                Improvements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plan and track value-adding projects.
              </Typography>
            </Box>
            {/* Component must handle fullWidth internally */}
            <AddProjectDialog homeId={id} />
          </Stack>
        </Box>

        {/* Summary Statistics */}
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 4, bgcolor: 'action.hover', borderRadius: 4 }}>
          <Stack 
            direction="row" 
            spacing={{ xs: 2, sm: 6 }} 
            divider={<Divider orientation="vertical" flexItem />}
            justifyContent="space-around"
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" fontWeight="bold" color="secondary.main" display="block">
                PLANNED
              </Typography>
              <Typography variant="h6" fontWeight="bold">{plannedProjects.length}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Est. ${totalPlannedBudget.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" fontWeight="bold" color="success.main" display="block">
                INVESTED
              </Typography>
              <Typography variant="h6" fontWeight="bold">{completedProjects.length}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                ${totalCompletedInvestment.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* SECTION 1: ACTIVE ROADMAP */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConstructionIcon color="secondary" fontSize="small" /> Active Roadmap
          </Typography>
          
          <Box sx={{ width: '100%', minWidth: 0 }}>
            {plannedProjects.length > 0 ? (
              <ProjectList homeId={home.id} projects={plannedProjects} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 4 }}>
                <Typography variant="body2" color="text.secondary">No active projects.</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* SECTION 2: COMPLETED PROJECTS */}
        {completedProjects.length > 0 && (
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" /> Completed
            </Typography>
            
            <Paper variant="outlined" sx={{ borderRadius: 3, width: '100%', overflow: 'hidden' }}>
              <List disablePadding>
                {completedProjects.map((project, index) => (
                  <Box key={project.id} sx={{ width: '100%' }}>
                    <ListItem 
                      sx={{ 
                        py: 2, 
                        px: { xs: 1.5, sm: 3 },
                        flexDirection: 'row', 
                        alignItems: 'center',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>{project.title}</Typography>}
                        secondary={
                          <Typography variant="caption" color="text.secondary" display="block">
                            ${project.estimatedCost?.toLocaleString()}
                          </Typography>
                        }
                        sx={{ m: 0, minWidth: 0 }}
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
    </Box>
  );
}