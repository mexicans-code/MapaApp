import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { styles } from '../styles/MapStyle';

const GOOGLE_MAPS_API_KEY = "AIzaSyCqvSzatNc9OiOYk6HL-GbThk0GI-rP2Oc";

const { ip_home, ip_school } = require('../constants/ip');


const UTEQ_COORDS = {
  latitude: 20.5888,
  longitude: -100.3899,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

const Mapa2Mejorado = () => {
  const [origen, setOrigen] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [rutas, setRutas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [destinosFiltrados, setDestinosFiltrados] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  
  // Estados para indicaciones
  const [indicaciones, setIndicaciones] = useState([]);
  const [mostrarIndicaciones, setMostrarIndicaciones] = useState(false);
  const [vozActivada, setVozActivada] = useState(true);
  const [indicacionActual, setIndicacionActual] = useState(0);
  const [leyendoIndicacion, setLeyendoIndicacion] = useState(false);
  
  const mapRef = useRef(null);

  const cambiarTipoMapa = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  // Función para leer indicación con voz
  const leerIndicacion = async (texto, indice = null) => {
    if (!vozActivada) return;
    
    try {
      setLeyendoIndicacion(true);
      if (indice !== null) {
        setIndicacionActual(indice);
      }
      
      await Speech.speak(texto, {
        language: 'es-ES',
        pitch: 1.0,
        rate: 0.8,
        voice: 'es-ES-AlvaroNeural', 
        onDone: () => setLeyendoIndicacion(false),
        onError: () => setLeyendoIndicacion(false)
      });
    } catch (error) {
      console.error('Error al reproducir voz:', error);
      setLeyendoIndicacion(false);
    }
  };

// Función para procesar indicaciones de la ruta
const procesarIndicaciones = (route) => {
  if (!route || !route.legs || route.legs.length === 0) return [];

  // Función para traducir las instrucciones al español
  const traducirInstruccion = (instruccion) => {
    const traducciones = {
      // Direcciones básicas
      'turn left': 'gira a la izquierda',
      'turn right': 'gira a la derecha',
      'turn slight left': 'gira ligeramente a la izquierda',
      'turn slight right': 'gira ligeramente a la derecha',
      'turn sharp left': 'gira bruscamente a la izquierda',
      'turn sharp right': 'gira bruscamente a la derecha',
      'keep left': 'mantente a la izquierda',
      'keep right': 'mantente a la derecha',
      'continue straight': 'continúa recto',
      'continue': 'continúa',
      'head': 'dirígete',
      'merge': 'incorpórate',
      
      // Autopistas y carreteras
      'take the ramp': 'toma la rampa',
      'take exit': 'toma la salida',
      'enter the roundabout': 'entra en la rotonda',
      'exit the roundabout': 'sal de la rotonda',
      'merge onto': 'incorpórate a',
      'continue on': 'continúa por',
      'follow': 'sigue',
      
      // Direcciones cardinales
      'north': 'norte',
      'south': 'sur',
      'east': 'este',
      'west': 'oeste',
      'northeast': 'noreste',
      'northwest': 'noroeste',
      'southeast': 'sureste',
      'southwest': 'suroeste',
      'sharp left': 'giro cerrado a la izquierda',
      'sharp right': 'giro cerrado a la derecha',

      
      // Palabras comunes
      'toward': 'hacia',
      'towards': 'hacia',
      'onto': 'a',
      'on': 'en',
      'at the': 'en el/la',
      'destination': 'destino',
      'your destination': 'tu destino',
      'arrive at': 'llega a',
      'you have arrived': 'has llegado',
      'destination will be en the right': 'tu destino estará a la derecha',

      
      // Tipos de vías
      'highway': 'autopista',
      'freeway': 'autopista',
      'road': 'carretera',
      'street': 'calle',
      'avenue': 'avenida',
      'drive': 'paseo',
      'boulevard': 'bulevar',
      'lane': 'carril',
      'way': 'camino',
      'route': 'ruta',
      
      // Preposiciones y conectores
      'and': 'y',
      'then': 'luego',
      'after': 'después de',
      'before': 'antes de',
      'for': 'durante',
      'in': 'en',
      'km': 'km',
      'mi': 'mi',
      'miles': 'millas',
      'feet': 'pies',
      'meters': 'metros',
      'm': 'm'
    };

    let instruccionTraducida = instruccion.toLowerCase();
    
    // Aplicar traducciones
    Object.keys(traducciones).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      instruccionTraducida = instruccionTraducida.replace(regex, traducciones[key]);
    });
    
    instruccionTraducida = instruccionTraducida.charAt(0).toUpperCase() + instruccionTraducida.slice(1);
    
    return instruccionTraducida;
  };

  const indicacionesProcesadas = [];

  route.legs.forEach((leg, legIndex) => {
    if (leg.steps) {
      leg.steps.forEach((step, stepIndex) => {
        let instruccion = step.html_instructions
          ? step.html_instructions
              .replace(/<[^>]*>/g, '') // Remover etiquetas HTML
              .replace(/&nbsp;/g, ' ')
              .trim()
          : 'Continúa recto';

        instruccion = traducirInstruccion(instruccion);

        indicacionesProcesadas.push({
          id: `${legIndex}-${stepIndex}`,
          instruccion: instruccion,
          distancia: step.distance ? step.distance.text : '',
          duracion: step.duration ? step.duration.text : '',
          coordenada: {
            latitude: step.start_location.lat,
            longitude: step.start_location.lng
          }
        });
      });
    }
  });

  return indicacionesProcesadas;
};

  // Función para determinar el tipo de destino
  const determinarTipoDestino = (nombre) => {
    const nombreLower = nombre.toLowerCase();
    
    if (nombreLower.includes('auditorio') || nombreLower.includes('salon') || nombreLower.includes('aula')) {
      return 'academico';
    } else if (nombreLower.includes('biblioteca')) {
      return 'biblioteca';
    } else if (nombreLower.includes('cafeteria') || nombreLower.includes('comedor') || nombreLower.includes('restaurante')) {
      return 'alimentacion';
    } else if (nombreLower.includes('laboratorio') || nombreLower.includes('lab')) {
      return 'laboratorio';
    } else if (nombreLower.includes('direccion') || nombreLower.includes('oficina') || nombreLower.includes('administracion')) {
      return 'administrativo';
    } else if (nombreLower.includes('gimnasio') || nombreLower.includes('deportivo') || nombreLower.includes('canchas')) {
      return 'deportivo';
    } else if (nombreLower.includes('estacionamiento') || nombreLower.includes('parking')) {
      return 'estacionamiento';
    } else if (nombreLower.includes('entrada') || nombreLower.includes('acceso')) {
      return 'acceso';
    } else {
      return 'general';
    }
  };

  // Función para guardar en historial
  const guardarEnHistorial = async (destinoData) => {
    try {
      const fechaActual = new Date();
      const historialItem = {
        nombre: destinoData.nombre,
        tipo: determinarTipoDestino(destinoData.nombre),
        dia: fechaActual.toLocaleDateString('es-ES'),
        hora: fechaActual.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        fechaCompleta: fechaActual.toISOString(),
        coordenadas: destinoData.posicion,
        userId: await AsyncStorage.getItem('id_user')
      };

      const response = await axios.post(`http://${ip_school}:3008/api/historial`, historialItem);

      if (response.data.success) {
        console.log('Destino guardado en historial exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar en historial:', error);
    }
  };

  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitamos acceso a tu ubicación para funcionar correctamente.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        setOrigen({ latitude, longitude });
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
      }
    };

    const obtenerDestinos = async () => {
      try {
        const response = await axios.get(`https://server-zeta-ten-25.vercel.app/api/destinos`);
        
        // ✅ CORRECTO - extrae solo el array de destinos
        setDestinos(response.data.data); // ← Nota el .data.data
        
      } catch (error) {
        console.error('Error al obtener destinos:', error);
        Alert.alert('Error', 'No se pudieron cargar los destinos.');
      }
    };

    obtenerUbicacion();
    obtenerDestinos();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setDestinosFiltrados([]);
      setMostrarSugerencias(false);
    } else {
      const filtrados = destinos.filter(destino =>
        destino.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setDestinosFiltrados(filtrados);
      setMostrarSugerencias(filtrados.length > 0);
    }
  }, [busqueda, destinos]);

  const obtenerRuta = async (destino) => {
    if (!origen || !destino || !destino.posicion) {
      Alert.alert('Error', 'Datos insuficientes para calcular la ruta.');
      return;
    }

    const destinoCoords = {
      latitude: destino.posicion.latitude,
      longitude: destino.posicion.longitude
    };

    const distancia = calcularDistancia(origen, destinoCoords);

    // Siempre intentar obtener ruta por calles primero
    await obtenerRutaPorCalles(destinoCoords, distancia);
  };

  const obtenerRutaPorCalles = async (destinoCoords, distanciaDirecta = null) => {
    // Si no se proporciona distancia directa, calcularla
    if (!distanciaDirecta) {
      distanciaDirecta = calcularDistancia(origen, destinoCoords);
    }

    // Para distancias muy cortas (menos de 100m), usar ruta directa
    if (distanciaDirecta < 100) {
      const rutaDirecta = [origen, destinoCoords];
      setRutas(rutaDirecta);
      setDestinoSeleccionado(destinoCoords);
      
      // Indicaciones simples para ruta directa
      const indicacionesSimples = [{
        id: '0',
        instruccion: `Dirígete directamente hacia tu destino`,
        distancia: `${Math.round(distanciaDirecta)}m`,
        duracion: `${Math.ceil(distanciaDirecta/80)} min`,
        coordenada: origen
      }];
      setIndicaciones(indicacionesSimples);
      
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(rutaDirecta, {
          edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
          animated: true,
        });
      }
      
      // Leer primera indicación
      if (vozActivada) {
        leerIndicacion(`Ruta calculada. ${indicacionesSimples[0].instruccion}. Distancia: ${indicacionesSimples[0].distancia}`);
      }
      
      return;
    }

    // Para distancias mayores, intentar ruta por calles
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origen.latitude},${origen.longitude}&destination=${destinoCoords.latitude},${destinoCoords.longitude}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      let response = await axios.get(url);
      
      // Si no funciona caminando, intentar en auto
      if (response.data.status !== 'OK' || response.data.routes.length === 0) {
        url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origen.latitude},${origen.longitude}&destination=${destinoCoords.latitude},${destinoCoords.longitude}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
        response = await axios.get(url);
      }
      
      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const puntosCodificados = route.overview_polyline.points;
        const puntosRuta = decodificarPolilinea(puntosCodificados);
        
        setRutas(puntosRuta);
        setDestinoSeleccionado(destinoCoords);
        
        // Procesar indicaciones detalladas
        const indicacionesDetalladas = procesarIndicaciones(route);
        setIndicaciones(indicacionesDetalladas);
        
        // Leer primera indicación automáticamente
        if (vozActivada && indicacionesDetalladas.length > 0) {
          const leg = route.legs[0];
          const distancia = leg.distance.text;
          const duracion = leg.duration.text;
          leerIndicacion(`Ruta calculada. Distancia: ${distancia}. Tiempo estimado: ${duracion}. ${indicacionesDetalladas[0].instruccion}`);
        }
        
        if (mapRef.current && puntosRuta.length > 0) {
          const todasLasCoordenadas = [origen, ...puntosRuta, destinoCoords];
          mapRef.current.fitToCoordinates(todasLasCoordenadas, {
            edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
            animated: true,
          });
        }
      } else {
        // Si falla la API, usar ruta directa como fallback
        usarRutaDirecta(destinoCoords, distanciaDirecta);
      }
    } catch (error) {
      console.error('Error al obtener ruta:', error);
      // Si hay error, usar ruta directa como fallback
      usarRutaDirecta(destinoCoords, distanciaDirecta);
    }
  };

  // Función auxiliar para usar ruta directa como fallback
  const usarRutaDirecta = (destinoCoords, distancia) => {
    const rutaDirecta = [origen, destinoCoords];
    setRutas(rutaDirecta);
    setDestinoSeleccionado(destinoCoords);
    
    const indicacionesSimples = [{
      id: '0',
      instruccion: `Dirígete directamente hacia tu destino`,
      distancia: `${Math.round(distancia)}m`,
      duracion: `${Math.ceil(distancia/80)} min`,
      coordenada: origen
    }];
    setIndicaciones(indicacionesSimples);
    
    if (vozActivada) {
      leerIndicacion(`Ruta directa calculada. Distancia: ${Math.round(distancia)} metros. ${indicacionesSimples[0].instruccion}`);
    }
  };

  const calcularDistancia = (punto1, punto2) => {
    const R = 6371e3;
    const φ1 = punto1.latitude * Math.PI/180;
    const φ2 = punto2.latitude * Math.PI/180;
    const Δφ = (punto2.latitude-punto1.latitude) * Math.PI/180;
    const Δλ = (punto2.longitude-punto1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const decodificarPolilinea = (encoded) => {
    if (!encoded) return [];
    
    let points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      points.push({ 
        latitude: lat / 1e5, 
        longitude: lng / 1e5 
      });
    }

    return points;
  };

  const limpiarRuta = () => {
    setRutas([]);
    setDestinoSeleccionado(null);
    setIndicaciones([]);
    setMostrarIndicaciones(false);
    setIndicacionActual(0);
    Speech.stop();
  };

  const seleccionarDestino = (destino) => {
    setBusqueda(destino.nombre);
    setMostrarSugerencias(false);
    Keyboard.dismiss();
    obtenerRuta(destino);
    
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: destino.posicion.latitude,
        longitude: destino.posicion.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setMostrarSugerencias(false);
    setDestinosFiltrados([]);
    limpiarRuta();
    Keyboard.dismiss();
  };

  // Función para obtener el icono según el tipo de destino
  const obtenerIconoDestino = (nombre) => {
    const nombreLower = nombre.toLowerCase();
    
    if (nombreLower.includes('auditorio') || nombreLower.includes('salon') || nombreLower.includes('aula')) {
      return 'school';
    } else if (nombreLower.includes('biblioteca')) {
      return 'local-library';
    } else if (nombreLower.includes('cafeteria') || nombreLower.includes('comedor') || nombreLower.includes('restaurante')) {
      return 'restaurant';
    } else if (nombreLower.includes('laboratorio') || nombreLower.includes('lab')) {
      return 'science';
    } else if (nombreLower.includes('direccion') || nombreLower.includes('oficina') || nombreLower.includes('administracion')) {
      return 'business';
    } else if (nombreLower.includes('gimnasio') || nombreLower.includes('deportivo') || nombreLower.includes('canchas')) {
      return 'fitness-center';
    } else if (nombreLower.includes('estacionamiento') || nombreLower.includes('parking')) {
      return 'local-parking';
    } else if (nombreLower.includes('entrada') || nombreLower.includes('acceso')) {
      return 'login';
    } else {
      return 'place';
    }
  };

  // Componente personalizado para marcador con icono
  const MarkerPersonalizado = ({ coordinate, title, onPress, isSelected, iconName }) => (
    <Marker
      coordinate={coordinate}
      title={title}
      onPress={onPress}
    >
      <View style={[
        styles.markerContainer,
        isSelected && styles.markerSeleccionado
      ]}>
        <MaterialIcons
          name={iconName}
          size={20}
          color={isSelected ? '#FFFFFF' : '#EA4335'}
        />
      </View>
    </Marker>
  );

  // Componente Modal de Indicaciones
  const ModalIndicaciones = () => (
    <Modal
      visible={mostrarIndicaciones}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setMostrarIndicaciones(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Indicaciones de Ruta</Text>
            <View style={styles.modalHeaderButtons}>
              <TouchableOpacity
                style={[styles.modalButton, vozActivada && styles.modalButtonActive]}
                onPress={() => setVozActivada(!vozActivada)}
              >
                <MaterialIcons
                  name={vozActivada ? 'volume-up' : 'volume-off'}
                  size={20}
                  color={vozActivada ? '#FFFFFF' : '#5F6368'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setMostrarIndicaciones(false)}
              >
                <MaterialIcons name="close" size={24} color="#5F6368" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.indicacionesList} showsVerticalScrollIndicator={false}>
            {indicaciones.map((indicacion, index) => (
              <TouchableOpacity
                key={indicacion.id}
                style={[
                  styles.indicacionItem,
                  index === indicacionActual && styles.indicacionActual
                ]}
                onPress={() => leerIndicacion(indicacion.instruccion, index)}
              >
                <View style={styles.indicacionNumero}>
                  <Text style={styles.indicacionNumeroTexto}>{index + 1}</Text>
                </View>
                <View style={styles.indicacionContenido}>
                  <Text style={styles.indicacionTexto}>{indicacion.instruccion}</Text>
                  {indicacion.distancia && (
                    <Text style={styles.indicacionDistancia}>
                      {indicacion.distancia} • {indicacion.duracion}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.indicacionBotonVoz}
                  onPress={() => leerIndicacion(indicacion.instruccion, index)}
                >
                  <MaterialIcons
                    name={leyendoIndicacion && index === indicacionActual ? 'pause' : 'volume-up'}
                    size={20}
                    color="#4285F4"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalFooterButton}
              onPress={() => {
                if (indicaciones.length > 0) {
                  const todasIndicaciones = indicaciones.map(ind => ind.instruccion).join('. ');
                  leerIndicacion(`Indicaciones completas: ${todasIndicaciones}`);
                }
              }}
            >
              <MaterialIcons name="play-arrow" size={20} color="#4285F4" />
              <Text style={styles.modalFooterButtonText}>Reproducir todas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Botón hamburguesa (opcional) */}
      <TouchableOpacity style={styles.menuButton}>
        <MaterialIcons name="menu" size={24} color="#5F6368" />
      </TouchableOpacity>

      {/* Barra de búsqueda estilo Google Maps */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={22} color="#9AA0A6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en el mapa"
            value={busqueda}
            onChangeText={setBusqueda}
            onFocus={() => setMostrarSugerencias(destinosFiltrados.length > 0)}
            placeholderTextColor="#9AA0A6"
          />
          {busqueda.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={limpiarBusqueda}>
              <MaterialIcons name="clear" size={20} color="#9AA0A6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Botones de control del mapa */}
      <View style={styles.mapControlsContainer}>
        <TouchableOpacity style={styles.mapControlButton} onPress={cambiarTipoMapa}>
          <MaterialIcons
            name={mapType === 'standard' ? 'layers' : 'map'}
            size={22}
            color="#5F6368"
          />
        </TouchableOpacity>
        
        {/* Botón de indicaciones */}
        {indicaciones.length > 0 && (
          <TouchableOpacity
            style={[styles.mapControlButton, styles.indicacionesButton]}
            onPress={() => setMostrarIndicaciones(true)}
          >
            <MaterialIcons name="list" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de sugerencias */}
      {mostrarSugerencias && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={destinosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => seleccionarDestino(item)}
              >
                <View style={styles.suggestionContent}>
                  <View style={styles.suggestionIconContainer}>
                    <MaterialIcons 
                      name={obtenerIconoDestino(item.nombre)} 
                      size={20} 
                      color="#5F6368" 
                    />
                  </View>
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionText}>{item.nombre}</Text>
                    <Text style={styles.suggestionSubtext}>UTEQ Campus</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        initialRegion={UTEQ_COORDS}
        onPress={limpiarRuta}
      >
        {/* Marcador de ubicación actual */}
        {origen && (
          <Marker
            coordinate={origen}
            title="Tu ubicación"
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationPulse} />
              <View style={styles.userLocationDot} />
            </View>
          </Marker>

        )}

        {/* Marcadores de destinos */}
        {destinos.map((destino) => (
          <MarkerPersonalizado
            key={destino.id}
            coordinate={destino.posicion}
            title={destino.nombre}
            iconName={obtenerIconoDestino(destino.nombre)}
            isSelected={destinoSeleccionado && 
              destinoSeleccionado.latitude === destino.posicion.latitude && 
              destinoSeleccionado.longitude === destino.posicion.longitude}
            onPress={() => {
              seleccionarDestino(destino);
              guardarEnHistorial(destino);
            }}
          />
        ))}

        {/* Polyline de la ruta */}
        {rutas.length > 0 && (
          <Polyline
            coordinates={rutas}
            strokeColor="#4285F4"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Marcador del destino seleccionado */}
        {destinoSeleccionado && (
          <Marker
            coordinate={destinoSeleccionado}
            title="Destino"
          >
            <View style={styles.destinationMarker}>
              <MaterialIcons name="place" size={30} color="#EA4335" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Botón de limpiar ruta */}
      {rutas.length > 0 && (
        <TouchableOpacity style={styles.clearRouteButton} onPress={limpiarRuta}>
          <MaterialIcons name="close" size={20} color="#FFFFFF" />
          <Text style={styles.clearRouteText}>Limpiar ruta</Text>
        </TouchableOpacity>
      )}

      {/* Botón de mi ubicación */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => {
          if (origen && mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: origen.latitude,
              longitude: origen.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }, 1000);
          }
        }}
      >
        <MaterialIcons name="my-location" size={24} color="#5F6368" />
      </TouchableOpacity>

      {/* Información de la ruta */}
      {rutas.length > 0 && indicaciones.length > 0 && (
        <View style={styles.routeInfoContainer}>
          <View style={styles.routeInfoContent}>
            <View style={styles.routeInfoText}>
              <Text style={styles.routeDistance}>
                {indicaciones[0]?.distancia || 'Calculando...'}
              </Text>
              <Text style={styles.routeDuration}>
                {indicaciones[0]?.duracion || 'Calculando tiempo...'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.startNavigationButton}
              onPress={() => setMostrarIndicaciones(true)}
            >
              <MaterialIcons name="navigation" size={20} color="#FFFFFF" />
              <Text style={styles.startNavigationText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal de Indicaciones */}
      <ModalIndicaciones />

      {/* Indicador de carga/reproducción de voz */}
      {leyendoIndicacion && (
        <View style={styles.speechIndicator}>
          <MaterialIcons name="volume-up" size={20} color="#4285F4" />
          <Text style={styles.speechText}>Reproduciendo indicación...</Text>
        </View>
      )}
    </View>
  );
};

export default Mapa2Mejorado;