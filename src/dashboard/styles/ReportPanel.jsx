import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    
    // Header styles (matching PersonalPanel)
    header: {
        backgroundColor: '#1565C0',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#E3F2FD',
        opacity: 0.9,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'flex-end',
        marginRight: 10,
    },
    profileName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    profileRole: {
        fontSize: 12,
        color: '#E3F2FD',
        opacity: 0.8,
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileText: {
        fontSize: 20,
    },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginRight: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    activeTab: {
        backgroundColor: '#1565C0',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },

    // Action buttons
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
    },
    actionButton: {
        backgroundColor: '#1565C0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },

    // Report content
    reportContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },

    // Metrics grid
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metricCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        width: (width - 50) / 2,
        marginBottom: 10,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    metricHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metricIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    metricTitle: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    // Additional stats
    additionalStats: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },

    // Charts
    chartContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },

    // Bar chart
    barItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    barLabel: {
        width: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    barLabelText: {
        fontSize: 12,
        color: '#666',
        flex: 1,
    },
    barValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 5,
    },
    barContainer: {
        flex: 1,
        height: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 10,
    },
    barPercentage: {
        fontSize: 11,
        color: '#666',
        width: 40,
        textAlign: 'right',
    },

    // Monthly chart
    monthItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    monthLabel: {
        width: 80,
        fontSize: 12,
        color: '#666',
    },
    monthBarContainer: {
        flex: 1,
        height: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    monthBar: {
        height: '100%',
        borderRadius: 8,
        minWidth: 4,
    },
    monthValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        width: 30,
        textAlign: 'center',
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },

    // Event cards
    eventCard: {
        backgroundColor: '#f8f9ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#1565C0',
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    eventName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    eventBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    eventDate: {
        fontSize: 11,
        color: '#1565C0',
        fontWeight: '500',
    },
    eventInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventDepartment: {
        fontSize: 12,
        color: '#666',
    },
    eventParticipants: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
    },
});