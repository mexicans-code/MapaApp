import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ip_home } from '../constants/ip';


const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = "AIzaSyCqvSzatNc9OiOYk6HL-GbThk0GI-rP2Oc";

const center = {
  latitude: 20.6547,
  longitude: -100.4026,
  latitudeDelta: 0.0001,
  longitudeDelta: 0.0001
};

export default function Map() {
  const [destino, setDestino] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [directions, setDirections] = useState(null);
  const [rutas, setRutas] = useState([]);
  const [pasos, setPasos] = useState([]);
  const [rutaInfo, setRutaInfo] = useState(null);
  const [navegacionActiva, setNavegacionActiva] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [mostrarIndicaciones, setMostrarIndicaciones] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchAnimation] = useState(new Animated.Value(0));
  const [destinos, setDestinos] = useState([]);


  const mapRef = useRef(null);

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

      const response = await axios.post(`${ip_home}:3008/api/historial`, historialItem);

      if (response.data.success) {
        console.log('Destino guardado en historial exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar en historial:', error);
    }
  };

  // Función para determinar el tipo de destino basado en el nombre
  const determinarTipoDestino = (nombre) => {
    const nombreLower = nombre.toLowerCase();

    if (nombreLower.includes('aula') ||
      nombreLower.includes('salón') ||
      nombreLower.includes('salon') ||
      nombreLower.includes('laboratorio') ||
      nombreLower.includes('lab') ||
      nombreLower.includes('edificio') ||
      nombreLower.includes('centro de cómputo')) {
      return 'aula';
    }

    if (nombreLower.includes('área verde') ||
      nombreLower.includes('area verde') ||
      nombreLower.includes('jardín') ||
      nombreLower.includes('jardin') ||
      nombreLower.includes('patio') ||
      nombreLower.includes('cancha') ||
      nombreLower.includes('explanada')) {
      return 'verde';
    }

    if (nombreLower.includes('director') ||
      nombreLower.includes('coordinador') ||
      nombreLower.includes('secretaria') ||
      nombreLower.includes('oficina') ||
      nombreLower.includes('despacho') ||
      nombreLower.includes('personal')) {
      return 'persona';
    }

    return 'aula'; // default
  };



  useEffect(() => {
    const fetchDestinos = async () => {
      try {
        const response = await axios.get(`http://${ip_school}:3000/destinos`);
        setDestinos(response.data);
      } catch (error) {
        console.error('Error al obtener destinos:', error);
        Alert.alert('Error', 'No se pudo cargar la lista de destinos');
      }
    };

    fetchDestinos();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Permiso denegado",
            "Necesitamos permisos de ubicación para mostrar tu posición en el mapa.",
            [{ text: "OK" }]
          );
          return;
        }

        setLocationPermissionGranted(true);

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });

        const { latitude, longitude } = location.coords;
        setOrigen({ latitude, longitude });

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);
        }
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        Alert.alert("Error", "No se pudo obtener tu ubicación actual.");
      }
    })();
  }, []);

  useEffect(() => {
    let subscription = null;

    const iniciarSeguimiento = async () => {
      if (!locationPermissionGranted) return;

      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (ubicacion) => {
            const { latitude, longitude } = ubicacion.coords;
            setOrigen({ latitude, longitude }); 

            if (destino && navegacionActiva) {
              calcularRuta({ latitude, longitude }, destino.posicion);
              actualizarPasoActual({ latitude, longitude });
            }
          }
        );
      } catch (error) {
        console.error("Error al seguir ubicación:", error);
      }
    };

    iniciarSeguimiento();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationPermissionGranted, destino, navegacionActiva]);

  // Función para calcular distancia entre dos puntos
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Actualizar paso actual basado en la ubicación
  const actualizarPasoActual = (ubicacionActual) => {
    if (!pasos.length || !ubicacionActual) return;

    let mejorPaso = 0;
    let menorDistancia = Infinity;

    pasos.forEach((paso, index) => {
      const distancia = calcularDistancia(
        ubicacionActual.latitude,
        ubicacionActual.longitude,
        paso.start_location.lat,
        paso.start_location.lng
      );

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        mejorPaso = index;
      }
    });

    // Solo actualizar si estamos cerca del siguiente paso (menos de 50 metros)
    if (menorDistancia < 50 && mejorPaso !== pasoActual) {
      setPasoActual(mejorPaso);
    }
  };

  function decodePolyline(encoded) {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  }

  // Función para limpiar texto HTML
  const limpiarHTML = (texto) => {
    return texto.replace(/<[^>]*>/g, '');
  };

  // Obtener icono para el tipo de maniobra
  const obtenerIconoManiobra = (maniobra) => {
    const iconos = {
      'turn-left': 'turn-left',
      'turn-right': 'turn-right',
      'turn-slight-left': 'turn-slight-left',
      'turn-slight-right': 'turn-slight-right',
      'turn-sharp-left': 'turn-sharp-left',
      'turn-sharp-right': 'turn-sharp-right',
      'straight': 'straight',
      'ramp-left': 'ramp-left',
      'ramp-right': 'ramp-right',
      'merge': 'merge',
      'fork-left': 'call-split',
      'fork-right': 'call-split',
      'ferry': 'directions-boat',
      'ferry-train': 'train',
      'roundabout-left': 'roundabout-left',
      'roundabout-right': 'roundabout-right'
    };

    return iconos[maniobra] || 'navigation';
  };

  const calcularRuta = async (origenCoords, destinoCoords) => {
    if (!origenCoords || !destinoCoords) return;
  
    try {
      // Validar coordenadas de entrada
      if (!origenCoords.latitude || !origenCoords.longitude || 
          !destinoCoords.latitude || !destinoCoords.longitude) {
        throw new Error('Coordenadas inválidas');
      }
  
      // Configuración mejorada para mayor precisión
      const params = new URLSearchParams({
        origin: `${origenCoords.latitude},${origenCoords.longitude}`,
        destination: `${destinoCoords.latitude},${destinoCoords.longitude}`,
        key: GOOGLE_MAPS_API_KEY,
        language: 'es',
        // Parámetros para mejorar precisión
        alternatives: 'true',              // Obtener rutas alternativas
        optimize: 'true',                  // Optimizar waypoints si los hay
        avoid: '',                         // Puedes agregar 'tolls', 'highways', 'ferries'
        units: 'metric',                   // Usar sistema métrico
        region: 'mx',                      // Región México para mejor localización
        traffic_model: 'best_guess',       // Modelo de tráfico más preciso
        departure_time: 'now',             // Tiempo actual para cálculo de tráfico
        // Modo de transporte específico para mayor precisión
        mode: 'walking',                   // driving, walking, bicycling, transit
        // Solicitar información detallada
        waypoint_optimization: 'true'
      });
  
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`,
        {
          timeout: 10000, // Timeout de 10 segundos
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.status === 'OK' && response.data.routes.length) {
        // Seleccionar la mejor ruta (primera por defecto, pero podemos mejorar la selección)
        let bestRoute = response.data.routes[0];
        
        // Si hay múltiples rutas, seleccionar la más óptima
        if (response.data.routes.length > 1) {
          bestRoute = response.data.routes.reduce((mejor, actual) => {
            const duracionMejor = mejor.legs[0].duration.value;
            const duracionActual = actual.legs[0].duration.value;
            const distanciaMejor = mejor.legs[0].distance.value;
            const distanciaActual = actual.legs[0].distance.value;
            
            // Priorizar por tiempo, luego por distancia
            if (duracionActual < duracionMejor) return actual;
            if (duracionActual === duracionMejor && distanciaActual < distanciaMejor) return actual;
            return mejor;
          });
        }
  
        const leg = bestRoute.legs[0];
        
        // Validar que la ruta tenga datos necesarios
        if (!leg || !bestRoute.overview_polyline || !bestRoute.overview_polyline.points) {
          throw new Error('Datos de ruta incompletos');
        }
  
        // Decodificar con mayor precisión
        const points = decodePolyline(bestRoute.overview_polyline.points);
        
        // Validar que los puntos sean válidos
        const validPoints = points.filter(point => 
          point.latitude && point.longitude && 
          !isNaN(point.latitude) && !isNaN(point.longitude) &&
          Math.abs(point.latitude) <= 90 && Math.abs(point.longitude) <= 180
        );
  
        if (validPoints.length === 0) {
          throw new Error('Puntos de ruta inválidos');
        }
  
        setRutas(validPoints);
        setDirections({ 
          status: 'OK',
          // Información adicional de la respuesta
          warnings: response.data.geocoded_waypoints?.map(wp => wp.geocoder_status) || [],
          copyrights: response.data.copyrights || '',
          availableRoutes: response.data.routes.length
        });
  
        // Información mejorada de la ruta
        const rutaInfoMejorada = {
          distancia: leg.distance?.text || 'No disponible',
          duracion: leg.duration?.text || 'No disponible',
          distanciaValor: leg.distance?.value || 0,
          duracionValor: leg.duration?.value || 0,
          // Información adicional
          duracionEnTrafico: leg.duration_in_traffic?.text || leg.duration?.text || 'No disponible',
          duracionEnTraficoValor: leg.duration_in_traffic?.value || leg.duration?.value || 0,
          direccionInicio: leg.start_address || 'Ubicación de origen',
          direccionFin: leg.end_address || 'Ubicación de destino',
          // Coordenadas precisas de inicio y fin
          coordenadasInicio: {
            lat: leg.start_location?.lat || origenCoords.latitude,
            lng: leg.start_location?.lng || origenCoords.longitude
          },
          coordenadasFin: {
            lat: leg.end_location?.lat || destinoCoords.latitude,
            lng: leg.end_location?.lng || destinoCoords.longitude
          },
          // Información adicional de calidad
          calidad: {
            puntosPolyline: validPoints.length,
            rutasAlternativas: response.data.routes.length,
            tiempoRespuesta: Date.now()
          }
        };
  
        setRutaInfo(rutaInfoMejorada);
  
        // Pasos con información mejorada
        const pasosDetallados = (leg.steps || []).map((step, index) => ({
          ...step,
          indice: index,
          // Decodificar polyline de cada paso para mayor precisión
          puntosDelPaso: step.polyline?.points ? decodePolyline(step.polyline.points) : [],
          // Información adicional del paso
          maniobra: step.maneuver || 'straight',
          tipoVia: step.html_instructions ? 
            step.html_instructions.replace(/<[^>]*>/g, '') : (step.instructions || 'Continuar'),
          // Validación de datos del paso
          distanciaValida: step.distance?.value > 0,
          duracionValida: step.duration?.value > 0
        }));
  
        setPasos(pasosDetallados);
        setPasoActual(0);
  
        // Ajustar el mapa con padding mejorado
        if (mapRef.current) {
          const coordenadasParaAjuste = [
            origenCoords, 
            ...validPoints.slice(0, Math.min(validPoints.length, 100)), // Limitar puntos para rendimiento
            destinoCoords
          ];
  
          // Validar que todas las coordenadas sean válidas antes de ajustar
          const coordenadasValidas = coordenadasParaAjuste.filter(coord => 
            coord && coord.latitude && coord.longitude &&
            !isNaN(coord.latitude) && !isNaN(coord.longitude)
          );
  
          if (coordenadasValidas.length > 1) {
            mapRef.current.fitToCoordinates(coordenadasValidas, {
              edgePadding: { 
                top: 120, 
                right: 80, 
                bottom: 200, 
                left: 80 
              },
              animated: true,
            });
          }
        }
  
        console.log('Ruta calculada exitosamente:', {
          distancia: rutaInfoMejorada.distancia,
          duracion: rutaInfoMejorada.duracion,
          puntos: validPoints.length,
          pasos: pasosDetallados.length
        });
  
      } else {
        // Manejo mejorado de errores específicos
        let mensajeError = "No se pudo encontrar una ruta a ese destino.";
        
        switch (response.data.status) {
          case 'NOT_FOUND':
            mensajeError = "Una de las ubicaciones no pudo ser encontrada.";
            break;
          case 'ZERO_RESULTS':
            mensajeError = "No hay rutas disponibles entre estos puntos.";
            break;
          case 'MAX_WAYPOINTS_EXCEEDED':
            mensajeError = "Demasiados puntos de paso en la ruta.";
            break;
          case 'INVALID_REQUEST':
            mensajeError = "Solicitud de ruta inválida.";
            break;
          case 'OVER_DAILY_LIMIT':
          case 'OVER_QUERY_LIMIT':
            mensajeError = "Límite de consultas excedido. Intenta más tarde.";
            break;
          case 'REQUEST_DENIED':
            mensajeError = "Acceso denegado al servicio de rutas.";
            break;
          case 'UNKNOWN_ERROR':
            mensajeError = "Error desconocido del servidor. Intenta nuevamente.";
            break;
          default:
            mensajeError = `Error del servicio: ${response.data.status}`;
        }
  
        Alert.alert("Ruta no encontrada", mensajeError);
        
        // Limpiar estados
        setRutas([]);
        setDirections(null);
        setPasos([]);
        setRutaInfo(null);
      }
  
    } catch (error) {
      console.error("Error detallado al obtener ruta:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        config: error.config ? {
          url: error.config.url,
          method: error.config.method,
          timeout: error.config.timeout
        } : null
      });
  
      // Mensaje de error más específico
      let mensajeError = "No se pudo calcular la ruta en este momento.";
      
      if (error.code === 'ECONNABORTED') {
        mensajeError = "La solicitud tardó demasiado tiempo. Intenta de nuevo.";
      } else if (error.response?.status === 403) {
        mensajeError = "Error de autenticación. Verifica la API key.";
      } else if (error.response?.status === 429) {
        mensajeError = "Demasiadas solicitudes. Espera un momento e intenta de nuevo.";
      } else if (error.response?.status === 400) {
        mensajeError = "Datos de ubicación inválidos.";
      } else if (!error.response) {
        mensajeError = "Error de conexión. Verifica tu conexión a internet.";
      } else if (error.message === 'Coordenadas inválidas') {
        mensajeError = "Las coordenadas proporcionadas no son válidas.";
      } else if (error.message === 'Puntos de ruta inválidos') {
        mensajeError = "La ruta calculada contiene puntos inválidos.";
      }
  
      Alert.alert("Error", mensajeError);
      
      // Limpiar estados
      setRutas([]);
      setDirections(null);
      setPasos([]);
      setRutaInfo(null);
    }
  };

  useEffect(() => {
    if (origen && destino) {
      calcularRuta(origen, destino.posicion);
    }
  }, [destino]);

  const cambiarTipoMapa = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const centerToUserLocation = async () => {
    if (!locationPermissionGranted) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude } = location.coords;

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    } catch (error) {
      console.error("Error al centrar ubicación:", error);
    }
  };

  const clearRoute = () => {
    setDestino(null);
    setRutas([]);
    setDirections(null);
    setPasos([]);
    setRutaInfo(null);
    setNavegacionActiva(false);
    setPasoActual(0);
    setMostrarIndicaciones(false);
  };

  const iniciarNavegacion = async () => {
    if (pasos.length > 0) {
      setNavegacionActiva(true);
      setMostrarIndicaciones(true);

      // Guardar en historial cuando se inicia la navegación
      if (destino) {
        await guardarEnHistorial(destino);
      }
    }
  };

  const detenerNavegacion = () => {
    setNavegacionActiva(false);
    setMostrarIndicaciones(false);
    setPasoActual(0);
  };

  const toggleSearchExpanded = () => {
    const toValue = searchExpanded ? 0 : 1;
    setSearchExpanded(!searchExpanded);

    Animated.timing(searchAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const getMarkerColor = (id) => {
    const colorMap = {
    };
    return colorMap[id] || 
      `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  };

  const Buscador = ({ onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDestinos, setFilteredDestinos] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (text) => {
      setSearchQuery(text);
      if (text.length > 0) {
        const filtered = destinos.filter(item =>
          item.nombre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredDestinos(filtered);
        setShowResults(true);
      } else {
        setFilteredDestinos([]);
        setShowResults(false);
      }
    };

    return (
      <View style={styles.searchContainer}>
        <Animated.View
          style={[
            styles.searchInputContainer,
            {
              height: searchAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [56, 80]
              })
            }
          ]}
        >
          <TouchableOpacity onPress={toggleSearchExpanded} style={styles.menuButton}>
            <MaterialIcons name="menu" size={24} color="#5f6368" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en UTEQ"
            placeholderTextColor="#5f6368"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => {
              setShowResults(true);
              if (!searchExpanded) toggleSearchExpanded();
            }}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setFilteredDestinos([]);
                setShowResults(false);
              }}
              style={styles.clearButton}
            >
              <MaterialIcons name="clear" size={20} color="#5f6368" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {showResults && filteredDestinos.length > 0 && (
          <View style={styles.searchResults}>
            <FlatList
              data={filteredDestinos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => {
                    onSelect(item);
                    setSearchQuery(item.nombre);
                    setShowResults(false);
                    toggleSearchExpanded();
                  }}
                >
                  <View style={styles.locationIcon}>
                    <MaterialIcons name="location-on" size={20} color={getMarkerColor(item.id)} />
                  </View>
                  <View style={styles.searchResultTextContainer}>
                    <Text style={styles.searchResultTitle} numberOfLines={1}>
                      {item.nombre.split(':')[0] || item.nombre}
                    </Text>
                    {item.nombre.includes(':') && (
                      <Text style={styles.searchResultSubtitle} numberOfLines={1}>
                        {item.nombre.split(':')[1]?.trim() || ''}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Mapa de fondo */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={center}
        mapType={mapType}
        showsUserLocation={true}
        followsUserLocation={navegacionActiva}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {destinos.map((d) => {
          if (destino && d.id !== destino.id) return null;
          return (
            <Marker
              key={d.id}
              coordinate={d.posicion}
              title={d.nombre}
            >
              <View style={[styles.customMarker, { backgroundColor: getMarkerColor(d.id) }]}>
                <MaterialIcons name="location-on" size={24} color="white" />
              </View>
            </Marker>
          );
        })}

        {rutas.length > 0 && (
          <Polyline
            coordinates={rutas}
            strokeWidth={6}
            strokeColor="#4285F4"
            lineDashPattern={[0]}
          />
        )}

        {origen && (
          <Marker coordinate={origen} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationDot} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Panel de búsqueda flotante */}
      <SafeAreaView style={styles.topContainer}>
        <Buscador onSelect={setDestino} destinos={destinos} />

      </SafeAreaView>

      {/* Indicación actual de navegación */}
      {navegacionActiva && pasos.length > 0 && pasoActual < pasos.length && (
        <View style={styles.navigationBanner}>
          <View style={styles.navigationIcon}>
            <MaterialIcons
              name={obtenerIconoManiobra(pasos[pasoActual].maneuver)}
              size={32}
              color="#4285F4"
            />
          </View>
          <View style={styles.navigationText}>
            <Text style={styles.navigationInstruction} numberOfLines={2}>
              {limpiarHTML(pasos[pasoActual].html_instructions)}
            </Text>
            <Text style={styles.navigationDistance}>
              En {pasos[pasoActual].distance.text}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setMostrarIndicaciones(true)}
            style={styles.navigationDetailsButton}
          >
            <MaterialIcons name="list" size={24} color="#5f6368" />
          </TouchableOpacity>
        </View>
      )}

      {/* Botones flotantes derecha */}
      <View style={[styles.rightButtonsContainer, { bottom: destino ? (navegacionActiva ? 280 : 200) : 100 }]}>
        <TouchableOpacity style={styles.floatingButton} onPress={cambiarTipoMapa}>
          <MaterialIcons
            name={mapType === 'standard' ? 'layers' : 'map'}
            size={24}
            color="#5f6368"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.floatingButton} onPress={centerToUserLocation}>
          <MaterialIcons name="my-location" size={24} color="#4285F4" />
        </TouchableOpacity>
      </View>

      {/* Panel inferior cuando hay destino seleccionado */}
      {destino && (
        <View style={styles.bottomPanel}>
          <View style={styles.destinationInfo}>
            <View style={styles.destinationHeader}>
              <View style={[styles.destinationIcon, { backgroundColor: getMarkerColor(destino.id) }]}>
                <MaterialIcons name="location-on" size={20} color="white" />
              </View>
              <View style={styles.destinationText}>
                <Text style={styles.destinationTitle} numberOfLines={1}>
                  {destino.nombre.split(':')[0] || destino.nombre}
                </Text>
                {destino.nombre.includes(':') && (
                  <Text style={styles.destinationSubtitle} numberOfLines={1}>
                    {destino.nombre.split(':')[1]?.trim() || ''}
                  </Text>
                )}
                {rutaInfo && (
                  <Text style={styles.routeInfo}>
                    {rutaInfo.distancia} · {rutaInfo.duracion}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.actionButtons}>
              {!navegacionActiva ? (
                <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={iniciarNavegacion}
                  disabled={!pasos.length}
                >
                  <MaterialIcons name="navigation" size={24} color="white" />
                  <Text style={styles.navigationButtonText}>Iniciar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={detenerNavegacion}
                >
                  <MaterialIcons name="stop" size={24} color="white" />
                  <Text style={styles.stopButtonText}>Detener</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.closeButton} onPress={clearRoute}>
                <MaterialIcons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal de indicaciones detalladas */}
      <Modal
        visible={mostrarIndicaciones}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarIndicaciones(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.directionsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Indicaciones</Text>
              <TouchableOpacity
                onPress={() => setMostrarIndicaciones(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
            </View>

            {rutaInfo && (
              <View style={styles.routeSummary}>
                <Text style={styles.routeSummaryText}>
                  {rutaInfo.distancia} · {rutaInfo.duracion}
                </Text>
              </View>
            )}

            <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
              {pasos.map((paso, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepItem,
                    index === pasoActual && navegacionActiva && styles.activeStep
                  ]}
                >
                  <View style={styles.stepIcon}>
                    <MaterialIcons
                      name={obtenerIconoManiobra(paso.maneuver)}
                      size={24}
                      color={index === pasoActual && navegacionActiva ? "#4285F4" : "#5f6368"}
                    />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepInstruction,
                      index === pasoActual && navegacionActiva && styles.activeStepText
                    ]}>
                      {limpiarHTML(paso.html_instructions)}
                    </Text>
                    <Text style={styles.stepDistance}>
                      {paso.distance.text} · {paso.duration.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: height,
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  searchContainer: {
    margin: 16,
    marginTop: Platform.OS === 'ios' ? 0 : 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 28,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButton: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
    paddingVertical: 16,
  },
  clearButton: {
    marginLeft: 12,
  },
  searchResults: {
    backgroundColor: 'white',
    marginTop: 8,
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  locationIcon: {
    marginRight: 16,
  },
  searchResultTextContainer: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 2,
  },
  navigationBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  navigationIcon: {
    marginRight: 16,
  },
  navigationText: {
    flex: 1,
  },
  navigationInstruction: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
  },
  navigationDistance: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 4,
  },
  navigationDetailsButton: {
    marginLeft: 8,
    padding: 8,
  },
  rightButtonsContainer: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
  },
  floatingButton: {
    width: 56,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  destinationInfo: {
    padding: 20,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  destinationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  destinationText: {
    flex: 1,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  destinationSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 2,
  },
  routeInfo: {
    fontSize: 14,
    color: '#4285F4',
    marginTop: 4,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigationButton: {
    flex: 1,
    backgroundColor: '#4285F4',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#EA4335',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(66, 133, 244, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  directionsModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.8,
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  modalCloseButton: {
    padding: 8,
  },
  routeSummary: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  routeSummaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4285F4',
  },
  stepsList: {
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  activeStep: {
    backgroundColor: '#e8f0fe',
  },
  stepIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 16,
    color: '#202124',
    lineHeight: 22,
  },
  activeStepText: {
    color: '#4285F4',
    fontWeight: '500',
  },
  stepDistance: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 4,
  },
});

