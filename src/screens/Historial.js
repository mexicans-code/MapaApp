import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import colors from '../assets/colors';
import { Iconos } from '../assets/iconos';

const historialData = [
  { id: '1', nombre: 'Área Verde Central', dia: '2025-07-01', hora: '10:30', tipo: 'verde' },
  { id: '2', nombre: 'Aula 203', dia: '2025-07-01', hora: '11:00', tipo: 'aula' },
  { id: '3', nombre: 'Encuentro con Juan Pérez', dia: '2025-07-01', hora: '12:00', tipo: 'persona' },
  { id: '4', nombre: 'Cancha Deportiva', dia: '2025-07-02', hora: '09:45', tipo: 'verde' },
  { id: '5', nombre: 'Laboratorio de Física', dia: '2025-07-02', hora: '10:20', tipo: 'aula' },
  { id: '6', nombre: 'Conversación con Ana López', dia: '2025-07-02', hora: '13:10', tipo: 'persona' },
  { id: '7', nombre: 'Jardín Principal', dia: '2025-07-03', hora: '08:55', tipo: 'verde' },
  { id: '8', nombre: 'Salón de Informática', dia: '2025-07-03', hora: '10:15', tipo: 'aula' },
  { id: '9', nombre: 'Charla con Maestro Carlos', dia: '2025-07-03', hora: '12:40', tipo: 'persona' },
];

const getColorByTipo = (tipo) => {
  switch (tipo) {
    case 'verde':
      return colors.verde;
    case 'aula':
      return colors.azulOscuro;
    case 'persona':
      return colors.amarillo;
    default:
      return colors.grisClaro;
  }
};

const getIconByTipo = (tipo) => {
  switch (tipo) {
    case 'verde':
      return <Iconos.Area size={24} />;
    case 'aula':
      return <Iconos.Edificio size={24} />;
    case 'persona':
      return <Iconos.Personal size={24}  />;
    default:
      return null;
  }
};

export default function Historial() {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={[styles.colorBar, { backgroundColor: getColorByTipo(item.tipo) }]} />
      <View style={styles.textContainer}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.detalle}>Fecha: {item.dia}</Text>
        <Text style={styles.detalle}>Hora: {item.hora}</Text>
      </View>
      <View style={styles.iconContainer}>
        {getIconByTipo(item.tipo)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={historialData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blanco,
    padding: 16,
  },
  title: {
    fontSize: 20,
    color: colors.azulOscuro,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grisMuyClaro,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  colorBar: {
    width: 8,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  nombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.grisOscuro,
  },
  detalle: {
    fontSize: 12,
    color: colors.grisMedio,
    marginTop: 2,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
