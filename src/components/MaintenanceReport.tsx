import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { HomeWithTasksAndLogs } from '@/app/actions/homeActions';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    backgroundColor: '#FFFFFF', 
    fontFamily: 'Helvetica', 
    lineHeight: 1.5 
  },
  // Header Section
  header: { 
    borderBottomWidth: 3, 
    borderBottomColor: '#4ade80', 
    borderBottomStyle: 'solid',
    paddingBottom: 12, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#020617',
    letterSpacing: 1 
  },
  subtitle: { 
    fontSize: 11, 
    color: '#475569', 
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  
  // Summary Stats Row
  statsRow: { 
    flexDirection: 'row', 
    gap: 15, 
    marginBottom: 30 
  },
  statBox: { 
    flex: 1, 
    backgroundColor: '#f8fafc', 
    padding: 12, 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  statLabel: { 
    fontSize: 7, 
    color: '#64748b', 
    textTransform: 'uppercase', 
    marginBottom: 4,
    fontWeight: 'bold'
  },
  statValue: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#020617' 
  },

  // Table Header - High Visibility
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#4ade80', // Emerald Background
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 4,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#020617', // Dark Navy Text for contrast
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Table Rows
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9', 
    borderBottomStyle: 'solid',
    minHeight: 38, 
    alignItems: 'center' 
  },
  
  // Column Widths & Contrast
  colDate: { width: '15%', fontSize: 9, paddingLeft: 8, color: '#334155' },
  colTask: { width: '25%', fontSize: 10, fontWeight: 'bold', color: '#020617' },
  colWho: { width: '20%', fontSize: 9, color: '#334155' },
  colCost: { width: '15%', fontSize: 10, textAlign: 'right', paddingRight: 12, fontWeight: 'bold', color: '#020617' },
  colNotes: { width: '25%', fontSize: 8.5, color: '#475569', paddingRight: 5 },

  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    fontSize: 9, 
    textAlign: 'center', 
    color: '#94a3b8',
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9', 
    paddingTop: 12
  }
});

export const MaintenanceReport = ({ home }: { home: HomeWithTasksAndLogs }) => {
  if (!home) return null;

  // Data Preparation
  const allLogs = home.tasks.flatMap((task) => 
    task.logs.map((log) => ({
      ...log,
      taskTitle: task.title,
    }))
  );

  const sortedLogs = allLogs.sort((a, b) => 
    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  const totalSpend = sortedLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

  return (
    <Document title={`${home.nickname} - Maintenance Report`}>
      <Page size="A4" style={styles.page}>
        
        {/* TOP BRANDING HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Maintenance Pedigree</Text>
          <Text style={styles.subtitle}>
            {home.nickname} | {home.address || 'Property Record'}
          </Text>
        </View>

        {/* FINANCIAL SUMMARY CARDS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Invested</Text>
            <Text style={styles.statValue}>
              ${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Service Count</Text>
            <Text style={styles.statValue}>{sortedLogs.length} Records</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Report Date</Text>
            <Text style={styles.statValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* HISTORY TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { width: '15%', paddingLeft: 8 }]}>Date</Text>
          <Text style={[styles.headerText, { width: '25%' }]}>Service</Text>
          <Text style={[styles.headerText, { width: '20%' }]}>Provider</Text>
          <Text style={[styles.headerText, { width: '15%', textAlign: 'right', paddingRight: 12 }]}>Cost</Text>
          <Text style={[styles.headerText, { width: '25%' }]}>Notes</Text>
        </View>

        {/* DATA ROWS */}
        {sortedLogs.map((log, i) => (
          <View 
            key={log.id} 
            style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#f8fafc' }]}
            wrap={false}
          >
            <Text style={styles.colDate}>
              {new Date(log.completedAt).toLocaleDateString()}
            </Text>
            <Text style={styles.colTask}>{log.taskTitle}</Text>
            <Text style={styles.colWho}>
              {log.provider?.name || log.performedBy || 'Self Managed'}
            </Text>
            <Text style={styles.colCost}>
              ${(log.cost || 0).toFixed(2)}
            </Text>
            <Text style={styles.colNotes}>
              {log.comment || '-'}
            </Text>
          </View>
        ))}

        {/* FOOTER */}
        <Text 
          style={styles.footer} 
          render={({ pageNumber, totalPages }) => (
            `HomeHealth AI • Verified Property Records • Page ${pageNumber} of ${totalPages}`
          )} 
          fixed 
        />
      </Page>
    </Document>
  );
};