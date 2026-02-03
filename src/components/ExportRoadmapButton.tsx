'use client';

import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { exportRoadmapToPDF } from "@/lib/pdfUtils";
import { FutureProject } from '@/generated/client/client';

interface ExportRoadmapButtonProps {
  homeNickname: string;
  projects: FutureProject[];
}

export default function ExportRoadmapButton({ homeNickname, projects }: ExportRoadmapButtonProps) {
  return (
    <Button 
      variant="outlined" 
      startIcon={<PictureAsPdfIcon />}
      onClick={() => exportRoadmapToPDF(homeNickname, projects)}
      sx={{ borderRadius: 2, fontWeight: 'bold' }}
    >
      Export Roadmap
    </Button>
  );
}