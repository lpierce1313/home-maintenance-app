import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from 'next/link';
import {
  Container, Typography, Card, CardContent,
  Button, Stack, Avatar, Box, Grid
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import EngineeringIcon from '@mui/icons-material/Engineering'; // New Icon
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // New Icon
import AddHomeDialog from '@/components/AddHomeDialog';
import DeleteHomeButton from '@/components/DeleteHomeButton';

import { getProvidersAction } from "@/app/actions/providerActions";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userHomes = await prisma.home.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  const providers = await getProvidersAction();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" component="h1">Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {session.user?.name}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <AddHomeDialog />

          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <Button
              type="submit"
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              sx={{ borderRadius: 2 }}
            >
              Logout
            </Button>
          </form>
        </Stack>
      </Stack>

      <Card
        variant="outlined"
        sx={{
          mb: 6,
          borderRadius: 4,
          bgcolor: 'action.hover',
          borderStyle: 'dashed',
          borderColor: 'primary.light'
        }}
      >
        <CardContent sx={{ py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <EngineeringIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Service Directory</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage {providers.length} professional contacts used across all homes.
                </Typography>
              </Box>
            </Stack>

            <Link href="/providers" style={{ textDecoration: 'none' }}>
              <Button
                endIcon={<ArrowForwardIcon />}
                variant="text"
                sx={{ fontWeight: 'bold' }}
              >
                View Directory
              </Button>
            </Link>
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>My Properties</Typography>

      {/* HOMES GRID */}
      <Grid container spacing={4}>
        {userHomes.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: 'center', py: 10, border: '2px dashed', borderColor: 'divider', borderRadius: 4 }}>
              <Typography variant="h6" color="text.secondary">
                You haven&apos;t added any homes yet.
              </Typography>
            </Box>
          </Grid>
        ) : (
          userHomes.map((home) => (
            <Grid key={home.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <DeleteHomeButton homeId={home.id} homeName={home.nickname} />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                      <HomeIcon />
                    </Avatar>
                    <Box sx={{ pr: 4 }}>
                      <Typography variant="h6" lineHeight={1.2} noWrap sx={{ maxWidth: '180px', fontWeight: 'bold' }}>
                        {home.nickname}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap component="div">
                        {home.address || 'No address set'}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    href={`/homes/${home.id}`}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    View Maintenance
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}