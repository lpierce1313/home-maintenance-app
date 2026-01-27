// src/app/login/page.tsx
import { signIn } from "@/auth";
import { Container, Box, Paper, Typography, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Welcome
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to manage your home maintenance
          </Typography>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem' }}
            >
              Sign in with Google
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}