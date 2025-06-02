import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const GOOGLE_MAPS_API_KEY = "AIzaSyAxRJvD9X6Qq-WPn2yMrOjsE5lALwMpxyg";

const { ip_home } = require('../constants/ip');

const Mapa2Mejorado = () => {
  const [origen, setOrigen] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [rutas, setRutas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [destinoSeleccionado, setDestinoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [destinosFiltrados, setDestinosFiltrados] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const mapRef = useRef(null);

  const cambiarTipoMapa = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  useEffect(() => {
    const obtenerUbicacion = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        console.log('Ubicación origen:', { latitude, longitude });
        setOrigen({ latitude, longitude });
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
      }
    };

    const obtenerDestinos = async () => {
      try {
        const response = await axios.get(`http://${ip_home}:3000/destinos`);
        console.log('Destinos obtenidos:', response.data);
        setDestinos(response.data);
      } catch (error) {
        console.error('Error al obtener destinos:', error);
        Alert.alert('Error', 'No se pudo obtener la lista de destinos.');
      }
    };

    obtenerUbicacion();
    obtenerDestinos();
  }, []);

  // Efecto para filtrar destinos según la búsqueda
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
      console.log('Faltan datos:', { origen, destino });
      Alert.alert('Error', 'Faltan datos de origen o destino.');
      return;
    }

    // Usar las coordenadas del objeto posicion
    const destinoCoords = {
      latitude: destino.posicion.latitude,
      longitude: destino.posicion.longitude
    };

    console.log('Calculando ruta desde:', origen, 'hasta:', destinoCoords);

    // Calcular distancia directa para decidir el tipo de ruta
    const distancia = calcularDistancia(origen, destinoCoords);
    console.log('Distancia directa:', distancia, 'metros');

    // Si la distancia es muy corta (menos de 500m), mostrar línea directa
    if (distancia < 500) {
      const rutaDirecta = [origen, destinoCoords];
      setRutas(rutaDirecta);
      setDestinoSeleccionado(destinoCoords);
      
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(rutaDirecta, {
          edgePadding: { top: 100, bottom: 100, left: 100, right: 100 },
          animated: true,
        });
      }
      
      Alert.alert(
        'Ruta Directa', 
        `Distancia aproximada: ${Math.round(distancia)}m\nTiempo estimado caminando: ${Math.ceil(distancia/80)}min`,
        [
          {
            text: 'Ruta por calles',
            onPress: () => obtenerRutaPorCalles(destinoCoords)
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
      return;
    }

    // Para distancias mayores, usar Google Maps
    await obtenerRutaPorCalles(destinoCoords);
  };

  const obtenerRutaPorCalles = async (destinoCoords) => {
    // Intentar primero con modo walking
    let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origen.latitude},${origen.longitude}&destination=${destinoCoords.latitude},${destinoCoords.longitude}&mode=walking&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      let response = await axios.get(url);
      console.log('Respuesta Google Maps (walking):', response.data.status);
      
      if (response.data.status !== 'OK' || response.data.routes.length === 0) {
        // Si no funciona walking, intentar con driving
        console.log('Intentando con modo driving...');
        url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origen.latitude},${origen.longitude}&destination=${destinoCoords.latitude},${destinoCoords.longitude}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
        response = await axios.get(url);
      }
      
      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const puntosCodificados = route.overview_polyline.points;
        const puntosRuta = decodificarPolilinea(puntosCodificados);
        console.log('Puntos de ruta decodificados:', puntosRuta.length, 'puntos');
        
        setRutas(puntosRuta);
        setDestinoSeleccionado(destinoCoords);
        
        // Mostrar información de la ruta
        const leg = route.legs[0];
        const distancia = leg.distance.text;
        const duracion = leg.duration.text;
        
        Alert.alert(
          'Ruta Calculada', 
          `Distancia: ${distancia}\nTiempo estimado: ${duracion}\n\nNota: Esta es la ruta por calles públicas. Dentro del campus puedes tomar atajos peatonales.`
        );
        
        // Centrar la vista en la ruta
        if (mapRef.current && puntosRuta.length > 0) {
          const todasLasCoordenadas = [origen, ...puntosRuta, destinoCoords];
          mapRef.current.fitToCoordinates(todasLasCoordenadas, {
            edgePadding: { top: 100, bottom: 100, left: 100, right: 100 },
            animated: true,
          });
        }
      } else {
        console.log('No se encontró ruta. Status:', response.data.status);
        // Como último recurso, mostrar línea directa
        const rutaDirecta = [origen, destinoCoords];
        setRutas(rutaDirecta);
        setDestinoSeleccionado(destinoCoords);
        
        const distancia = calcularDistancia(origen, destinoCoords);
        Alert.alert(
          'Ruta Directa', 
          `No se encontró ruta por calles.\nDistancia directa: ${Math.round(distancia)}m\nTiempo estimado caminando: ${Math.ceil(distancia/80)}min`
        );
      }
    } catch (error) {
      console.error('Error al obtener ruta:', error);
      // Mostrar línea directa como fallback
      const rutaDirecta = [origen, destinoCoords];
      setRutas(rutaDirecta);
      setDestinoSeleccionado(destinoCoords);
      
      const distancia = calcularDistancia(origen, destinoCoords);
      Alert.alert(
        'Ruta Directa', 
        `Error de conexión.\nMostrando ruta directa: ${Math.round(distancia)}m`
      );
    }
  };

  // Función para calcular distancia entre dos puntos
  const calcularDistancia = (punto1, punto2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = punto1.latitude * Math.PI/180;
    const φ2 = punto2.latitude * Math.PI/180;
    const Δφ = (punto2.latitude-punto1.latitude) * Math.PI/180;
    const Δλ = (punto2.longitude-punto1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
  };

  // Función mejorada para decodificar la polilínea de Google
  const decodificarPolilinea = (encoded) => {
    if (!encoded) return [];
    
    let points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;

      // Decodificar latitud
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      // Decodificar longitud
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

    console.log('Decodificación completa:', points.length, 'puntos');
    return points;
  };

  const limpiarRuta = () => {
    setRutas([]);
    setDestinoSeleccionado(null);
  };

  const seleccionarDestino = (destino) => {
    setBusqueda(destino.nombre);
    setMostrarSugerencias(false);
    Keyboard.dismiss();
    obtenerRuta(destino);
    
    // Centrar el mapa en el destino seleccionado
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: destino.posicion.latitude,
        longitude: destino.posicion.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
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

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar destino (ej: auditorio, biblioteca, cafetería...)"
          value={busqueda}
          onChangeText={setBusqueda}
          onFocus={() => setMostrarSugerencias(destinosFiltrados.length > 0)}
          clearButtonMode="while-editing"
        />
        {busqueda.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={limpiarBusqueda}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Botón flotante para cambiar tipo de mapa */}
      <TouchableOpacity style={styles.mapTypeButton} onPress={cambiarTipoMapa}>
        <MaterialIcons
          name={mapType === 'standard' ? 'satellite' : 'map'}
          size={24}
          color="white"
        />
      </TouchableOpacity>

      {/* Lista de sugerencias */}
      {mostrarSugerencias && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={destinosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => seleccionarDestino(item)}
              >
                <Text style={styles.suggestionText}>{item.nombre}</Text>
                <Text style={styles.suggestionId}>ID: {item.id}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: origen?.latitude || 20.6736,
          longitude: origen?.longitude || -103.344,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={limpiarRuta} // Limpiar ruta al tocar el mapa
      >
        {/* Marcador del origen */}
        {origen && (
          <Marker
            coordinate={origen}
            title="Mi ubicación"
            description="Punto de partida"
            pinColor="green"
          />
        )}

        {/* Mostrar los marcadores de los destinos */}
        {destinos.map((dest, index) => (
          <Marker
            key={dest.id || index}
            coordinate={{ 
              latitude: dest.posicion.latitude, 
              longitude: dest.posicion.longitude 
            }}
            title={dest.nombre}
            description={`ID: ${dest.id}`}
            pinColor={destinoSeleccionado && 
              destinoSeleccionado.latitude === dest.posicion.latitude && 
              destinoSeleccionado.longitude === dest.posicion.longitude 
              ? "red" : "blue"}
            onPress={() => {
              console.log('Marcador presionado:', dest);
              obtenerRuta(dest);
            }}
          />
        ))}

        {/* Mostrar la ruta trazada */}
        {rutas.length > 0 && (
          <Polyline
            coordinates={rutas}
            strokeColor={rutas.length === 2 ? "#00FF00" : "#FF0000"}
            strokeWidth={rutas.length === 2 ? 3 : 4}
            lineDashPattern={rutas.length === 2 ? [10, 10] : [1]}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  mapTypeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 110,
    left: 10,
    right: 10,
    zIndex: 999,
    maxHeight: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  suggestionId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default Mapa2Mejorado;