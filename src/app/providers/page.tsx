import { getProvidersAction } from "@/app/actions/providerActions";
import {
    Container, Typography, Grid, Card, CardContent,
    Stack, Avatar, Divider, Box,
    Button, Link
} from '@mui/material';

import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export default async function ProvidersPage() {
    const providers = await getProvidersAction();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                component={Link}
                href="/"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 4 }}
                color="inherit"
            >
                Back to Homes
            </Button>


            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
                Service Directory
            </Typography>

            <Grid container spacing={3}>
                {providers.map((pro) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pro.id}>
                        <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <BusinessIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" noWrap>
                                            {pro.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Used {pro.jobCount} times
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack spacing={1} sx={{ mb: 2 }}>
                                    {pro.phone && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PhoneIcon fontSize="inherit" color="action" />
                                            <Typography variant="body2">{pro.phone}</Typography>
                                        </Stack>
                                    )}
                                    {pro.email && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <EmailIcon fontSize="inherit" color="action" />
                                            <Typography variant="body2">{pro.email}</Typography>
                                        </Stack>
                                    )}
                                </Stack>

                                <Divider sx={{ my: 1.5 }} />

                                {pro.lastLog ? (
                                    <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                            <HistoryIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                            <Typography variant="caption" fontWeight="bold" color="primary">
                                                LAST JOB
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" fontWeight="medium" noWrap>
                                            {pro.lastLog.task.title}
                                        </Typography>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <HomeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {pro.lastLog.task.home.nickname}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ) : (
                                    <Typography variant="caption" color="text.disabled">
                                        No service history yet.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}