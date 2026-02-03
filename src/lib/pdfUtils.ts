// src/lib/pdfUtils.ts
import { FutureProject } from '@/generated/client/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportRoadmapToPDF = (homeName: string, projects: FutureProject[]) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text(`${homeName} - Improvement Roadmap`, 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 27);

  // 1. Add "Completed" to the headers
  const tableColumn = ["Project Title", "Estimated Cost", "Assigned To", "Status", "Completed"];
  
  // 2. Add an empty string at the end of each row for the pencil-in space
  const tableRows = projects.map(p => [
    p.title,
    p.estimatedCost ? `$${p.estimatedCost.toLocaleString()}` : '-',
    p.assignedTo || 'Unassigned',
    p.status,
    "" // Empty column for manual entry
  ]);

  // Use the directly imported autoTable function
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: 'grid', // 'grid' shows borders, making it easier to write in
    headStyles: { 
      fillColor: [25, 118, 210], 
      textColor: [255, 255, 255],
      fontStyle: 'bold' 
    },
    // 3. Specific column styles to make the "Completed" box wider
    columnStyles: {
      0: { cellWidth: 'auto' }, // Title
      1: { cellWidth: 30 },     // Cost
      2: { cellWidth: 35 },     // Assigned
      3: { cellWidth: 25 },     // Status
      4: { cellWidth: 25 },     // Completed (Pencil-in space)
    },
    styles: { 
      fontSize: 9,
      minCellHeight: 10, // Gives more vertical space for handwriting
      valign: 'middle'
    },
    margin: { top: 35 },
  });

  doc.save(`${homeName.replace(/\s+/g, '_')}_Roadmap.pdf`);
};