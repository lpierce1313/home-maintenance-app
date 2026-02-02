// src/components/NotificationToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography, Box, Alert, Snackbar, Stack } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { saveSubscriptionAction } from '@/app/actions/pushActions';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function NotificationToggle() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already subscribed on this browser
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isSubscribed) {
        // 1. Request Permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Permission not granted for notifications');
        }

        // 2. Register Service Worker
        const reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // 3. Subscribe to Push Manager
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
        });

        // 4. Save to Database
        const subJSON = sub.toJSON();
        if (subJSON.endpoint && subJSON.keys) {
          await saveSubscriptionAction({
            endpoint: subJSON.endpoint,
            keys: {
              p256dh: subJSON.keys.p256dh,
              auth: subJSON.keys.auth
            }
          });
          setIsSubscribed(true);
        }
      } else {
        // Logic to unsubscribe if they toggle off
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        await sub?.unsubscribe();
        setIsSubscribed(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <NotificationsActiveIcon color={isSubscribed ? "primary" : "disabled"} />
        <FormControlLabel
          control={
            <Switch 
              checked={isSubscribed} 
              onChange={handleToggle} 
              disabled={loading}
            />
          }
          label={
            <Box>
              <Typography variant="body1" fontWeight="bold">
                Push Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isSubscribed ? "Enabled on this device" : "Receive alerts for due tasks"}
              </Typography>
            </Box>
          }
        />
      </Stack>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}