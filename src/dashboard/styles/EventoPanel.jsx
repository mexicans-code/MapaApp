import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#1565C0',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#E3F2FD',
        textAlign: 'center',
        fontWeight: '500',
    },
    addButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
        paddingHorizontal: 20,
    },
    eventoCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    idBadge: {
        backgroundColor: '#1565C0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    idText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 10,
    },
    editButton: {
        backgroundColor: '#FF9800',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#F44336',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    eventoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        lineHeight: 24,
    },
    eventoDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 15,
    },
    eventDetails: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#1565C0',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailIcon: {
        fontSize: 16,
        marginRight: 10,
        width: 20,
    },
    detailText: {
        fontSize: 13,
        color: '#333',
        flex: 1,
    },
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: width * 0.9,
        maxHeight: height * 0.85,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 25,
    },
    formGroup: {
        marginBottom: 20,
    },

    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginBottom: 20,
    },
    formHalf: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
        color: '#333',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        gap: 15,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#1565C0',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },

    selectButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },

    selectButtonActive: {
        backgroundColor: '#1565C0',
        borderColor: '#1565C0',
    },

    selectButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },

    selectButtonTextActive: {
        color: '#fff',
        fontWeight: '600',
    },

    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
    },

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


});

export default styles;