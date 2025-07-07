import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import images from '../assets/img/images';
import styles from './components/styles/Home';

const screenWidth = Dimensions.get('window').width;
const ip_home = '192.168.100.96';

export default function Home() {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [moreVisited, setMoreVisited] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchMoreVisited();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchEvents(), fetchMoreVisited()]);
    setRefreshing(false);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://${ip_home}:3000/api/events`);
      const activeEvents = (response.data.data || []).filter(event => event.estado === 'activo');
      console.log('Total de eventos recibidos:', response.data.data?.length || 0);
      console.log('Total de eventos activos:', activeEvents.length);
      setEvents(activeEvents);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de eventos');
    }
  };

  const fetchMoreVisited = async () => {
    try {
      const response = await axios.get(`http://${ip_home}:3000/api/most-visited`);
      const transformedData = response.data.map((item) => ({
        key: item.id?.toString() || item._id?.toString() || item.nombre?.toLowerCase(),
        label: item.nombre,
        img: item.imagen ? { uri: item.imagen } : images.imagen
      }));
      setMoreVisited(transformedData);
      console.log('More Visited:', transformedData);
    } catch (error) {
      console.error('Error al obtener mas visitados:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de mas visitados');
    }
  };

  // Función para navegar al mapa con el evento seleccionado
  const navigateToEventLocation = (event) => {
    // Validar que el evento tenga coordenadas
    if (!event.latitude || !event.longitude) {
      Alert.alert('Error', 'Este evento no tiene ubicación definida');
      return;
    }

    const eventCoords = {
      latitude: parseFloat(event.latitude),
      longitude: parseFloat(event.longitude)
    };

    // Navegar al mapa pasando los datos del evento
    navigation.navigate('Mapa2Mejorado', { 
      eventData: event,
      destinoCoords: eventCoords,
      navigateToEvent: true 
    });
  };

  const getCategoryIcon = (categoria) => {
    switch (categoria) {
      case 'Académico': return '🎓';
      case 'Deportivo': return '⚽';
      case 'Cultural': return '🎭';
      case 'Ceremonial': return '🎉';
      case 'Social': return '👥';
      default: return '📅';
    }
  };

  const formatDate = (fecha) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return fecha;
    }
  };

  const formatTime = (hora) => {
    try {
      return hora;
    } catch (error) {
      return hora;
    }
  };

  const renderVisitedItem = ({ item }) => (
    <TouchableOpacity style={styles.visitedItem} activeOpacity={0.7}>
      <Image source={item.img} style={styles.visitedImage} />
      <View style={styles.labelOverImage}>
        <Text style={styles.visitedText}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1565C0" barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1565C0']} />
        }
      >
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Bienvenido 🎓 </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Más visitados</Text>
          <FlatList
            data={moreVisited}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.key}
            renderItem={renderVisitedItem}
            contentContainerStyle={styles.visitedListContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eventos disponibles</Text>
          {events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay eventos disponibles</Text>
            </View>
          ) : (
            events.map((event) => {
              const formattedDate = formatDate(event.fecha);
              const formattedTime = formatTime(event.hora);

              return (
                <TouchableOpacity 
                  key={event.id || event._id} 
                  style={styles.eventCard}
                  activeOpacity={0.8}
                  onPress={() => navigateToEventLocation(event)}
                >
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventDate}>{formattedDate}</Text>
                      <Text style={styles.categoryIcon}>{getCategoryIcon(event.categoria)}</Text>
                    </View>
                    
                    <View style={styles.eventBody}>
                      <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle}>{event.titulo}</Text>
                        <Text style={styles.eventDescription} numberOfLines={2}>
                          {event.descripcion}
                        </Text>
                        
                        <View style={styles.eventDetails}>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailIcon}>🕐</Text>
                            <Text style={styles.detailText}>{formattedTime}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailIcon}>📍</Text>
                            <Text style={styles.detailText}>{event.ubicacion}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailIcon}>👨‍💼</Text>
                            <Text style={styles.detailText}>{event.organizador}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.eventImageContainer}>
                        <Image 
                          source={event.imagen ? {uri: event.imagen} : images.imagen} 
                          style={styles.eventImage} 
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}