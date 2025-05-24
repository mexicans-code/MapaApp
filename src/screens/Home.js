import React from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colores from '../assets/colors';
import images from '../assets/img/images';
import Buscador from './components/Buscador';

const screenWidth = Dimensions.get('window').width;

const moreVisited = [
  { key: 'cafeteria', label: 'Cafetería', img: images.imagen },
  { key: 'auditorio', label: 'Auditorio', img: images.imagen },
  { key: 'canchas', label: 'Canchas', img: images.imagen },
  { key: 'biblioteca', label: 'Biblioteca', img: images.imagen },
  { key: 'laboratorio', label: 'Laboratorio', img: images.imagen },
];

const eventsByDate = {
  '2025-05-21': [
    {
      id: 'e1',
      title: 'Conferencia sobre tecnología',
      time: '10:00 AM',
      location: 'Auditorio',
      img: images.imagen,
    },
    {
      id: 'e2',
      title: 'Taller de robótica',
      time: '2:00 PM',
      location: 'Laboratorio',
      img: images.imagen,
    },
  ],
  '2025-05-22': [
    {
      id: 'e3',
      title: 'Torneo de fútbol',
      time: '4:00 PM',
      location: 'Canchas deportivas',
      img: images.imagen,
    },
  ],
};

export default function Home() {
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
      {Object.entries(eventsByDate).map(([date, events]) => (
        <View key={date} style={styles.eventDateSection}>
          <Text style={styles.eventDate}>{new Date(date).toLocaleDateString()}</Text>
          {events.map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDetail}>{event.time}</Text>
                <Text style={styles.eventDetail}>{event.location}</Text>
              </View>
              <Image source={event.img} style={styles.eventImage} />
            </View>
          ))}
        </View>
      ))}
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
