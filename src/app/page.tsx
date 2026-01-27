import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Container, Typography, Card, CardContent, 
  Button, Stack, Avatar, Box, Divider, Grid 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AddHomeDialog from '@/components/AddHomeDialog';
import DeleteHomeButton from '@/components/DeleteHomeButton';

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userHomes = await prisma.home.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        spacing={2}
        sx={{ mb: 6 }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" component="h1">My Homes</Typography>
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
            >
              Logout
            </Button>
          </form>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 6 }} />

      {/* HOMES GRID */}
      <Grid container spacing={4}>
        {userHomes.length === 0 ? (
          <Grid size={12}>
            <Box sx={{ textAlign: 'center', py: 10, border: '2px dashed', borderColor: 'divider', borderRadius: 4 }}>
              <Typography variant="h6" color="text.secondary">
                You haven&apos;t added any homes yet.
              </Typography>
            </Box>
          </Grid>
        ) : (
          userHomes.map((home) => (
            <Grid key={home.id} size={{ xs: 12, md: 4 }}>
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
                {/* DELETE BUTTON (Top Right Corner) */}
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <DeleteHomeButton homeId={home.id} homeName={home.nickname} />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <HomeIcon />
                    </Avatar>
                    <Box sx={{ pr: 4 }}> {/* Padding right so name doesn't hit trash icon */}
                      <Typography variant="h6" lineHeight={1.2} noWrap sx={{ maxWidth: '180px' }}>
                        {home.nickname}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap component="div">
                        {home.address || 'No address set'}
                      </Typography>
                    </Box>
                  </Box>
                  <Button fullWidth variant="contained" href={`/homes/${home.id}`}>
                    View Tasks
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