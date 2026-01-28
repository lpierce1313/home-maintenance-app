import { HomeWithTasksAndLogs } from '@/lib/types';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        lineHeight: 1.4
    },
    header: {
        borderBottomWidth: 2,
        borderBottomColor: '#4ade80',
        paddingBottom: 15,
        marginBottom: 20
    },
    title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', letterSpacing: 0.5 },
    subtitle: { fontSize: 9, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },

    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statBox: {
        flex: 1,
        padding: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        backgroundColor: '#fafafa'
    },
    statLabel: { fontSize: 7, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2, fontWeight: 'bold' },
    statValue: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },

    // Category Section
    categorySection: { marginTop: 15, marginBottom: 5 },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#4ade80',
        marginBottom: 8
    },
    categoryTitle: { fontSize: 10, fontWeight: 'bold', color: '#166534', textTransform: 'uppercase', letterSpacing: 1 },
    categoryCount: { fontSize: 8, color: '#94a3b8', marginLeft: 6 },

    // Table Structure
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerText: { fontSize: 7, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
        paddingVertical: 8,
        alignItems: 'flex-start'
    },

    colDate: { width: '12%', fontSize: 8, color: '#64748b' },
    colTask: { width: '25%', fontSize: 9, fontWeight: 'bold', color: '#0f172a', paddingRight: 5 },
    colWho: { width: '28%' },
    providerName: { fontSize: 8, fontWeight: 'bold', color: '#334155' },
    providerContact: { fontSize: 7, color: '#94a3b8', marginTop: 1 }, // Tighter spacing
    colCost: { width: '12%', fontSize: 9, textAlign: 'right', fontWeight: 'bold', color: '#0f172a', paddingRight: 10 },
    colNotes: { width: '23%', fontSize: 8, color: '#64748b', fontStyle: 'italic' },

    footer: {
        position: 'absolute', bottom: 30, left: 40, right: 40,
        fontSize: 7, textAlign: 'center', color: '#cbd5e1',
        borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10
    }
});

export const MaintenanceReport = ({ home }: { home: HomeWithTasksAndLogs }) => {
    if (!home) return null;

    const allLogs = home.tasks.flatMap((task) =>
        task.logs.map((log) => ({
            ...log,
            taskTitle: task.title,
            category: task.category || 'General',
        }))
    );

    const groupedLogs = allLogs.reduce((acc, log) => {
        const cat = log.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(log);
        return acc;
    }, {} as Record<string, typeof allLogs>);

    const categories = Object.keys(groupedLogs).sort();
    const totalSpend = allLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

    return (
        <Document title={`${home.nickname} - Record of Maintenance`}>
            <Page size="A4" style={styles.page}>

                <View style={styles.header}>
                    <Text style={styles.title}>Maintenance Pedigree</Text>
                    <Text style={styles.subtitle}>{home.nickname} • {home.address || 'Property Record'}</Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Investment</Text>
                        <Text style={styles.statValue}>${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Records</Text>
                        <Text style={styles.statValue}>{allLogs.length} Events</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>As of Date</Text>
                        <Text style={styles.statValue}>{new Date().toLocaleDateString()}</Text>
                    </View>
                </View>

                {categories.map((cat) => (
                    <View key={cat} style={styles.categorySection} wrap={false}>
                        <View style={styles.categoryHeader}>
                            <Text style={styles.categoryTitle}>{cat}</Text>
                            <Text style={styles.categoryCount}>({groupedLogs[cat].length})</Text>
                        </View>

                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerText, { width: '12%' }]}>Date</Text>
                            <Text style={[styles.headerText, { width: '25%' }]}>Task</Text>
                            <Text style={[styles.headerText, { width: '28%' }]}>Provider</Text>
                            <Text style={[styles.headerText, { width: '12%', textAlign: 'right', paddingRight: 10 }]}>Cost</Text>
                            <Text style={[styles.headerText, { width: '23%' }]}>Notes</Text>
                        </View>

                        {groupedLogs[cat]
                            .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                            .map((log) => (
                                <View key={log.id} style={styles.tableRow}>
                                    <Text style={styles.colDate}>{new Date(log.completedAt).toLocaleDateString()}</Text>
                                    <Text style={styles.colTask}>{log.taskTitle}</Text>

                                    <View style={styles.colWho}>
                                        <Text style={styles.providerName}>
                                            {log.provider?.name || log.performedBy || 'Self Managed'}
                                        </Text>
                                        {log.provider && (
                                            <View style={styles.providerContact}>
                                                <Text>
                                                    {[log.provider.email, log.provider.phone].filter(Boolean).join('  •  ')}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <Text style={styles.colCost}>${(log.cost || 0).toFixed(2)}</Text>
                                    <Text style={styles.colNotes}>{log.comment || '-'}</Text>
                                </View>
                            ))}
                    </View>
                ))}

                <Text
                    style={styles.footer}
                    render={({ pageNumber, totalPages }) => `HomeHealth AI • Verified Records • Page ${pageNumber} of ${totalPages}`}
                    fixed
                />
            </Page>
        </Document>
    );
};