// styles/MapStyle.js
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 40,
  },
  
  // Contenedor de búsqueda estilo Uber
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // Botón hamburguesa
  menuButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  // Contenedor del input de búsqueda
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  searchIcon: {
    marginRight: 12,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
    fontFamily: 'Roboto-Regular',
  },
  
  clearButton: {
    padding: 4,
  },

  // Botón de mi ubicación
  myLocationButton: {
    position: 'absolute',
    bottom: 220,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },

  trackingIndicator: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 8,
  },
   stopButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },


  // Botón de capas (tipo de mapa)
  layersButton: {
    position: 'absolute',
    bottom: 280,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },

  // Mapa
  map: {
    flex: 1,
  },

  // Marcadores personalizados
  markerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#15304d',
  },
  
  markerSeleccionado: {
    backgroundColor: '#15304d',
    borderColor: '#FFFFFF',
  },

  // Bottom Sheet de Sugerencias
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999,
    paddingBottom: 40,
  },

  

  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DADCE0',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },

  // Items de sugerencias
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  
  suggestionIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
  },
  
  suggestionTextContainer: {
    flex: 1,
  },
  
  suggestionText: {
    fontSize: 16,
    color: '#202124',
    fontFamily: 'Roboto-Regular',
  },
  
  suggestionSubtext: {
    fontSize: 14,
    color: '#5F6368',
    fontFamily: 'Roboto-Regular',
    marginTop: 2,
  },

  // Bottom Sheet de Ruta
  routeBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999,
    paddingBottom: 40,
  },

  routeHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DADCE0',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },

  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  routeTime: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#202124',
  },

  routeDistance: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#5F6368',
    marginTop: 2,
  },

  closeRouteButton: {
    padding: 8,
  },

  routeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },

   startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  detailsButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },

  detailsButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  },
  // Modal de indicaciones
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.8,
    minHeight: height * 0.6,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: '#202124',
  },
  
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  modalButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 8,
    marginRight: 8,
  },
  
  modalButtonActive: {
    backgroundColor: '#4285F4',
  },
  
  modalCloseButton: {
    padding: 4,
  },
  
  indicacionesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  indicacionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  
  indicacionActual: {
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  
  indicacionNumero: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  
  indicacionNumeroTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  
  indicacionContenido: {
    flex: 1,
    marginRight: 8,
  },
  
  indicacionTexto: {
    fontSize: 16,
    color: '#202124',
    fontFamily: 'Roboto-Regular',
    lineHeight: 22,
  },
  
  indicacionDistancia: {
    fontSize: 14,
    color: '#5F6368',
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
  
  indicacionBotonVoz: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
  },

  // Información adicional de la ruta
  routeInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  routeInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  routeInfoText: {
    flex: 1,
  },
  
  routeDuration: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#5F6368',
    marginTop: 2,
  },
  
  startNavigationButton: {
    backgroundColor: '#4285F4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  startNavigationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginLeft: 4,
  },

  // Indicador de voz
  speechIndicator: {
    position: 'absolute',
    bottom: 200,
    left: 16,
    right: 16,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  speechText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
  },

  // Botón de limpiar ruta
  clearRouteButton: {
    position: 'absolute',
    top: 120,
    left: 16,
    backgroundColor: '#15304d',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  
  clearRouteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginLeft: 4,
  },

  // Marcadores específicos
  userLocationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  userLocationPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    opacity: 0.3,
  },
  
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  
  destinationMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Controles adicionales del mapa
  mapControlsContainer: {
    position: 'absolute',
    top: 120,
    right: 16,
    zIndex: 1000,
  },
  
  mapControlButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  indicacionesButton: {
    backgroundColor: '#4285F4',
  },

  // Footer del modal
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EAED',
  },
  
  modalFooterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  
  modalFooterButtonText: {
    fontSize: 14,
    color: '#4285F4',
    fontFamily: 'Roboto-Medium',
    marginLeft: 8,
  },
});