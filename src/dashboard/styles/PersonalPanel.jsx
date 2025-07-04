import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    
    // Header Styles
    header: {
        backgroundColor: '#1565C0',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerLeft: {
        flex: 1
    },
    titleContainer: {
        marginBottom: 5
    },
    headerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 2
    },
    headerSubtitle: {
        color: '#E3F2FD',
        fontSize: 14,
        fontWeight: '400'
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileInfo: {
        alignItems: 'flex-end',
        marginRight: 10
    },
    profileName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    profileRole: {
        color: '#E3F2FD',
        fontSize: 12
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileText: {
        fontSize: 18
    },

    // Stats Container
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: -10,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 5
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    },

    // Add Button
    addButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },

    // List Styles
    list: {
        flex: 1,
        paddingHorizontal: 15
    },

    // Personal Card Styles
    personalCard: {
        backgroundColor: '#fff',
        marginVertical: 8,
        marginHorizontal: 5,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50'
    },
    inactiveCard: {
        backgroundColor: '#f9f9f9',
        borderLeftColor: '#f44336',
        opacity: 0.8
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap'
    },
    empleadoBadge: {
        backgroundColor: '#1565C0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4
    },
    empleadoText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 4
    },
    activeBadge: {
        backgroundColor: '#E8F5E8'
    },
    inactiveBadge: {
        backgroundColor: '#FFEBEE'
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500'
    },
    cardActions: {
        flexDirection: 'row',
        marginLeft: 'auto'
    },
    statusButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    statusButtonText: {
        fontSize: 16
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    editButtonText: {
        fontSize: 16
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f44336',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButtonText: {
        fontSize: 16
    },

    // Personal Info Styles
    personalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        lineHeight: 24
    },
    personalInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        flexWrap: 'wrap'
    },
    infoLabel: {
        fontSize: 13,
        color: '#666',
        marginRight: 8,
        minWidth: 100,
        fontWeight: '500'
    },
    infoText: {
        fontSize: 13,
        color: '#333',
        flex: 1,
        flexWrap: 'wrap'
    },

    // Loading Styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666'
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center'
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        width: width * 0.9,
        maxHeight: '85%',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 25,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },

    // Form Styles
    formGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#333'
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top'
    },

    // Radio Group Styles
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 8
    },
    radioOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#f9f9f9'
    },
    radioSelected: {
        backgroundColor: '#E3F2FD',
        borderColor: '#1565C0'
    },
    radioText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333'
    },

    // Modal Actions
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    cancelButton: {
        flex: 0.45,
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600'
    },
    saveButton: {
        flex: 0.45,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#4CAF50'
    },
    saveButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600'
    }
});

export default styles;