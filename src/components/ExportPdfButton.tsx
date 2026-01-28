'use client';
import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MaintenanceReport } from './MaintenanceReport';
import { HomeWithTasksAndLogs } from '@/app/actions/homeActions';

export default function ExportButton({ home }: { home: HomeWithTasksAndLogs }) {
  const [isClient, setIsClient] = useState(false);

  // This ensures the component only renders after the initial mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outlined" disabled startIcon={<FileDownloadIcon />}>
        Loading...
      </Button>
    );
  }

  return (
    <PDFDownloadLink 
      document={<MaintenanceReport home={home}/>}
      fileName={`${home?.nickname.replace(/\s+/g, '_')}_Maintenance.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={20} /> : <FileDownloadIcon />}
          disabled={loading}
          sx={{ fontWeight: 'bold' }}
        >
          {loading ? 'Preparing PDF...' : 'Export Maintenance PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}