import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from 'next/link';
import {
  Container, Typography, Card, CardContent,
  Button, Stack, Avatar, Box, Grid, GlobalStyles
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddHomeDialog from '@/components/AddHomeDialog';
import DeleteHomeButton from '@/components/DeleteHomeButton';

import { getProvidersAction } from "@/app/actions/providerActions";
import NotificationToggle from "@/components/NotificationToggle";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userHomes = await prisma.home.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  const providers = await getProvidersAction();

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <GlobalStyles styles={{
        body: { overflowX: 'hidden', width: '100%' },
        '*': { boxSizing: 'border-box' }
      }} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>

        {/* Header Section */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 4, width: '100%' }} // Ensure the outer stack spans the full container
        >
          <Box sx={{ flexShrink: 0 }}> {/* Prevents the title from being squished */}
            <Typography
              variant="h3"
              fontWeight="bold"
              component="h1"
              sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}
            >
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {session.user?.name}
            </Typography>
          </Box>

          {/* Inner Button Stack */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2} // Increase this to 3 if you want more air between buttons
            sx={{
              width: { xs: '100%', sm: 'auto' },
              justifyContent: 'flex-end', // Aligns buttons to the right on desktop
              minWidth: { sm: '300px' }   // Forces the button area to be wider on desktop
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'auto' }, flexGrow: { sm: 0 } }}>
              <AddHomeDialog />
            </Box>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
              style={{ width: '100%' }}
            >
              <Button
                type="submit"
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                fullWidth
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: { sm: '120px' } // Ensures the logout button has a nice minimum width
                }}
              >
                Logout
              </Button>
            </form>
          </Stack>
        </Stack>

                <NotificationToggle />

        {/* Service Directory Card - Responsive Stacking */}
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
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  <EngineeringIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Service Directory</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage {providers.length} professional contacts.
                  </Typography>
                </Box>
              </Stack>

              <Link href="/providers" style={{ textDecoration: 'none', width: '100%' }}>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  variant="text"
                  sx={{
                    fontWeight: 'bold',
                    justifyContent: { xs: 'center', sm: 'flex-end' }
                  }}
                >
                  View Directory
                </Button>
              </Link>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>My Properties</Typography>

        {/* HOMES GRID */}
        <Grid container spacing={3}>
          {userHomes.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ textAlign: 'center', py: 8, border: '2px dashed', borderColor: 'divider', borderRadius: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No properties added yet.
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
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                    <DeleteHomeButton homeId={home.id} homeName={home.nickname} />
                  </Box>

                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                        <HomeIcon />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {home.nickname}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {home.address || 'No address set'}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={1.5}>
                      <Button
                        fullWidth
                        variant="contained"
                        href={`/homes/${home.id}`}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1 }}
                      >
                        Maintenance
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        href={`/homes/${home.id}/projects`}
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1 }}
                      >
                        Improvements
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}