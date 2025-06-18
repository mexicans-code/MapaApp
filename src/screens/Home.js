import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Colores from '../assets/colors';
import images from '../assets/img/images';
import { ip_school } from '../constants/ip';
import Buscador from './components/Buscador';

const screenWidth = Dimensions.get('window').width;


export default function Home() {
  const [events, setEvents] = useState([]);
  const [moreVisited, setMoreVisited] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://${ip_school}:3000/events`);
        setEvents(response.data);
        console.log('Events:', response.data);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
        Alert.alert('Error', 'No se pudo cargar la lista de eventos');
      }
    };

    const fetchMoreVisited = async () => {
      try {
        const response = await axios.get(`http://${ip_school}:3000/most-visited`);
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

    fetchEvents();
    fetchMoreVisited();
  }, []);

  const renderVisitedItem = ({ item }) => (
    <View style={styles.visitedItem}>
      <Image source={item.img} style={styles.visitedImage} />
      <View style={styles.labelOverImage}>
        <Text style={styles.visitedText}>{item.label}</Text>
      </View>
    </View>
  );

  const handleSearchChange = (text) => {
    console.log('Buscar:', text);
  };

  const handlePressFiltro = () => {
    console.log('Filtro presionado');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>A donde quieres ir?</Text>
      <Buscador 
        placeholder="Buscar"
        onChangeText={handleSearchChange}
        onPressFiltro={handlePressFiltro}
      />

      <Text style={styles.sectionTitle}>Más visitados</Text>
      <FlatList
        data={moreVisited}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={renderVisitedItem}
        contentContainerStyle={styles.visitedListContainer}
      />

      <Text style={styles.sectionTitle}>Eventos</Text>
      {events.map((event) => {
        const eventDate = new Date(event.fecha);
        const formattedDate = eventDate.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const formattedTime = eventDate.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        return (
          <View key={event.id || event._id} style={styles.eventDateSection}>
            <Text style={styles.eventDate}>{formattedDate}</Text>
            <View style={styles.eventItem}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.nombre}</Text>
                <Text style={styles.eventDetail}>📅 {formattedDate}</Text>
                <Text style={styles.eventDetail}>🕐 {formattedTime}</Text>
                <Text style={styles.eventDetail}>📍 {event.lugar}</Text>
              </View>
              <Image 
                source={{uri: event.imagen}} 
                style={styles.eventImage} 
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const ITEM_WIDTH = screenWidth * 0.65;
const ITEM_HEIGHT = 190;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colores.blanco,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    color: '#444', // gris suave para no saturar
  },
  visitedListContainer: {
    paddingLeft: 12,
    paddingBottom: 20,
  },
  visitedItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginRight: 18,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    // sombra suave para elevar las tarjetas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  visitedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  labelOverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  visitedText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  eventDateSection: {
    marginBottom: 32,
  },
  eventDate: {
    fontWeight: '600',
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    // sombra ligera
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  eventInfo: {
    flex: 1,
    marginRight: 14,
  },
  eventTitle: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 3,
    color: '#333',
  },
  eventDetail: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  eventImage: {
    width: 70,
    height: 50,
    borderRadius: 10,
  },
});
