import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from '@/lib/theme';

import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://home-maintenance-app-eight.vercel.app/'
  ),
  title: "UpKeep | Home Maintenance",
  description: "The intelligent roadmap for your home's health and maintenance.",
  
  applicationName: 'Up Keep',
  authors: [{ name: 'Luke Pierce' }],
  generator: 'Next.js',
  keywords: ['home maintenance', 'home care', 'property management', 'UpKeep'],
  
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    siteName: 'Up Keep',
    title: 'Up Keep | Home Maintenance',
    description: 'Track your home tasks and protect your biggest investment.',
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Up Keep Logo',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Up Keep',
    description: 'Smart home maintenance tracking.',
    images: ['/web-app-manifest-512x512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}