import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Iconos } from '../../assets/iconos';
import Colores from '../../assets/colors';
import { useNavigation } from '@react-navigation/native';

export default function Buscador({ placeholder = "Buscar", onChangeText }) {
  const navigation = useNavigation();

  const irAMap = () => {
    navigation.navigate('Filtro');
  };

  return (
    <View style={styles.searchContainer}>
      <Iconos.Lupa size={20} color="#999" style={styles.iconLeft} />
      <TextInput
        placeholder={placeholder}
        style={styles.searchInput}
        placeholderTextColor="#999"
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.iconRight} onPress={irAMap}>
        <Iconos.Filtro size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colores.grisMuyClaro,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  iconLeft: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: Colores.grisOscuro,
  },
  iconRight: {
    marginLeft: 8,
  },
});
