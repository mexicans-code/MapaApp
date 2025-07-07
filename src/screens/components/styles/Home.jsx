import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  scrollView: {
    flex: 1,
  },
  
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  
  section: {
    marginBottom: 25,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  
  // Estilos para lugares más visitados
  visitedListContainer: {
    paddingHorizontal: 15,
  },
  
  visitedItem: {
    width: 150,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  visitedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  labelOverImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  
  visitedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Estilos para eventos
  eventCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  eventContent: {
    padding: 15,
  },
  
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  eventDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  categoryIcon: {
    fontSize: 24,
  },
  
  eventBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  eventInfo: {
    flex: 1,
    paddingRight: 15,
  },
  
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
    lineHeight: 24,
  },
  
  eventDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  
  eventDetails: {
    gap: 6,
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  
  detailText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  
  eventImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // Estado vacío
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  
  bottomSpacer: {
    height: 20,
  },
});