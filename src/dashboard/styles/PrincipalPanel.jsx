import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

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
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        marginRight: 15,
        padding: 8,
    },
    menuLine: {
        width: 18,
        height: 2,
        backgroundColor: '#fff',
        marginBottom: 3,
        borderRadius: 1,
    },
    titleContainer: {
        flex: 1,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'flex-end',
        marginRight: 12,
    },
    profileName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    profileRole: {
        fontSize: 12,
        color: '#E3F2FD',
    },
    profileIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    profileText: {
        fontSize: 20,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    statsCard: {
        flex: 0.48,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
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
    fullWidthCard: {
        flex: 1,
        marginRight: 0,
    },
    statsIconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#E3F2FD',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    statsIcon: {
        fontSize: 24,
    },
    statsContent: {
        flex: 1,
    },
    statsNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 2,
    },
    statsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    statsSubLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '400',
    },
    statsChange: {
        fontSize: 11,
        color: '#4CAF50',
        fontWeight: '500',
    },
    actionsSection: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    actionButton: {
        flex: 0.48,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        minHeight: 130,
    },
    fullWidthButton: {
        flex: 1,
        marginRight: 0,
    },
    buttonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    buttonIcon: {
        fontSize: 32,
    },
    buttonBadge: {
        backgroundColor: '#FF5722',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
    },
    buttonTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        lineHeight: 20,
    },
    buttonDescription: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
        flexWrap: 'wrap',
    },
    bottomSpacing: {
        height: 30,
    },
});

export default styles;