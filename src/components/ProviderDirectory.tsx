'use client'

import { 
  Typography, Box, Card, CardContent, Grid, 
  Avatar, Stack, Divider
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EngineeringIcon from '@mui/icons-material/Engineering';

interface Provider {
  name: string | null;
  totalJobs: number;
  totalSpent: number;
  lastJobDate?: Date;
  lastJobTitle?: string;
}

export default function ProviderDirectory({ providers }: { providers: Provider[] }) {
  if (providers.length === 0) return null;

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <EngineeringIcon color="primary" /> Service Provider Directory
      </Typography>
      
      <Grid container spacing={2}>
        {providers.map((pro) => (
          <Grid size={{ xs: 12, sm: 6}} key={pro.name}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{pro.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pro.totalJobs} jobs completed
                    </Typography>
                  </Box>
                </Stack>
                
                <Divider sx={{ mb: 2 }} />
                
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Total Paid:</Typography>
                  <Typography variant="body2" fontWeight="bold">${pro.totalSpent.toLocaleString()}</Typography>
                </Stack>

                <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Last Service:
                  </Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {pro.lastJobTitle} — {pro.lastJobDate ? new Date(pro.lastJobDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}