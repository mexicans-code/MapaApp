import React, { useState } from 'react';
import {View,Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, FlatList} from 'react-native';
import colors from '../assets/colors';
import { Iconos } from '../assets/iconos';
import { useNavigation } from '@react-navigation/native';

export default function Filtro() {
  const navigation = useNavigation();

  const [mostrarEdificio, setMostrarEdificio] = useState(false);
  const [mostrarArea, setMostrarArea] = useState(false);
  const [mostrarPersona, setMostrarPersona] = useState(false);

  const [edificioSeleccionado, setEdificioSeleccionado] = useState('');
  const [aulaSeleccionada, setAulaSeleccionada] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [personaSeleccionada, setPersonaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const edificios = ['A', 'B', 'C', 'D'];
  const aulas = ['101', '102', '201', '202'];
  const areas = ['Jardín central', 'Cancha', 'Entrada principal'];
  const personas = ['Juan Pérez', 'María López', 'Carlos Ramírez', 'Ana Torres', 'Luis Mendoza'];

  const irAMap  = () => {
    navigation.navigate('Map', {
      edificio: edificioSeleccionado,
      aula: aulaSeleccionada,
      area: areaSeleccionada,
      persona: personaSeleccionada,
    });
  };

  const handleToggle = (type) => {
    setMostrarArea(type === 'area' ? !mostrarArea : false);
    setMostrarEdificio(type === 'edificio' ? !mostrarEdificio : false);
    setMostrarPersona(type === 'persona' ? !mostrarPersona : false);
  };

  const personasFiltradas = personas.filter((persona) =>
    persona.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Filtrar por:</Text>

      {/* Área Verde */}
      <TouchableOpacity
        style={[styles.optionButton, { borderLeftColor: colors.verde }]}
        onPress={() => handleToggle('area')}
      >
        <View style={styles.optionContent}>
          <View style={[styles.dot, { backgroundColor: colors.verde }]} />
          <Iconos.Area size={24} color={colors.verde} style={styles.icon} />
          <Text style={[styles.optionText, { color: colors.verde }]}>Área Verde</Text>
        </View>
      </TouchableOpacity>

      {mostrarArea && (
        <View style={styles.desplegable}>
          <Text style={styles.label}>Selecciona un área:</Text>
          <View style={[styles.pickerContainer, { maxHeight: 150 }]}>
            <ScrollView>
              {areas.map((area) => (
                <TouchableOpacity key={area} onPress={() => setAreaSeleccionada(area)}>
                  <Text style={styles.optionItem}>{area}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {areaSeleccionada !== '' && (
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.verde }]}
              onPress={irAMap }
            >
              <Text style={styles.confirmText}>Ir al Map </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Edificio y Aula */}
      <TouchableOpacity
        style={[styles.optionButton, { borderLeftColor: colors.azulOscuro }]}
        onPress={() => handleToggle('edificio')}
      >
        <View style={styles.optionContent}>
          <View style={[styles.dot, { backgroundColor: colors.azulOscuro }]} />
          <Iconos.Edificio size={24} color={colors.azulOscuro} style={styles.icon} />
          <Text style={[styles.optionText, { color: colors.azulOscuro }]}>Edificio y Aula</Text>
        </View>
      </TouchableOpacity>

      {mostrarEdificio && (
        <View style={styles.desplegable}>
          <Text style={styles.label}>Selecciona un edificio:</Text>
          <View style={[styles.pickerContainer, { maxHeight: 150 }]}>
            <ScrollView>
              {edificios.map((edif) => (
                <TouchableOpacity key={edif} onPress={() => setEdificioSeleccionado(edif)}>
                  <Text style={styles.optionItem}>Edificio {edif}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.label}>Selecciona un aula (opcional):</Text>
          <View style={[styles.pickerContainer, { maxHeight: 150 }]}>
            <ScrollView>
              {aulas.map((aula) => (
                <TouchableOpacity key={aula} onPress={() => setAulaSeleccionada(aula)}>
                  <Text style={styles.optionItem}>Aula {aula}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {edificioSeleccionado !== '' && (
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.azulOscuro }]}
              onPress={irAMap }
            >
              <Text style={styles.confirmText}>Ir al Map </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Persona */}
      <TouchableOpacity
        style={[styles.optionButton, { borderLeftColor: colors.amarillo }]}
        onPress={() => handleToggle('persona')}
      >
        <View style={styles.optionContent}>
          <View style={[styles.dot, { backgroundColor: colors.amarillo }]} />
          <Iconos.Personal size={24} color={colors.amarillo} style={styles.icon} />
          <Text style={[styles.optionText, { color: colors.amarillo }]}>Persona</Text>
        </View>
      </TouchableOpacity>

      {mostrarPersona && (
        <View style={styles.desplegable}>
          <Text style={styles.label}>Buscar persona:</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Escribe un nombre..."
            value={busqueda}
            onChangeText={setBusqueda}
          />

          <FlatList
            data={personasFiltradas}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.personaItem,
                  personaSeleccionada === item && styles.personaSeleccionada,
                ]}
                onPress={() => setPersonaSeleccionada(item)}
              >
                <Text style={styles.personaTexto}>{item}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            style={{ maxHeight: 150 }}
          />

          {personaSeleccionada !== '' && (
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.amarillo }]}
              onPress={irAMap}
            >
              <Text style={styles.confirmText}>Ir al Mapa </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blanco,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.grisOscuro,
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 6,
    backgroundColor: '#f7f7f7',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
  },
  desplegable: {
    backgroundColor: colors.grisMuyClaro,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    color: colors.grisOscuro,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.grisMedio,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    padding: 8,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: colors.grisOscuro,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.grisMedio,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  personaItem: {
    backgroundColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  personaSeleccionada: {
    backgroundColor: colors.amarillo,
  },
  personaTexto: {
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});
