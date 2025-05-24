import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../assets/colors';

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  azulOscuro: {
    backgroundColor: colors.azulOscuro,
  },
  blanco: {
    backgroundColor: colors.blanco,
    borderWidth: 2,
    borderColor: colors.azulOscuro,
  },
  rojoOscuro: {
    backgroundColor: colors.rojoOscuro,
  },
  textAzulBlanco: {
    color: colors.blanco,
  },
  textRojo: {
    color: colors.blanco,
  },
  textBotonBlanco: {
    color: colors.azulOscuro,
  },
  botonPequeno: {
    width: '80%',
    paddingVertical: 10,
    alignSelf: 'center',
  },
});

const BotonAzulOscuro = ({ onPress, texto }) => (
  <TouchableOpacity style={[styles.button, styles.azulOscuro]} onPress={onPress}>
    <Text style={[styles.text, styles.textAzulBlanco]}>{texto}</Text>
  </TouchableOpacity>
);

const BotonAzulOscuroPequeno = ({ onPress, texto }) => (
  <TouchableOpacity
    style={[styles.button, styles.azulOscuro, styles.botonPequeno]}
    onPress={onPress}
  >
    <Text style={[styles.text, styles.textAzulBlanco]}>{texto}</Text>
  </TouchableOpacity>
);

const BotonBlanco = ({ onPress, texto }) => (
  <TouchableOpacity style={[styles.button, styles.blanco]} onPress={onPress}>
    <Text style={[styles.text, styles.textBotonBlanco]}>{texto}</Text>
  </TouchableOpacity>
);

const BotonRojoOscuro = ({ onPress, texto }) => (
  <TouchableOpacity style={[styles.button, styles.rojoOscuro]} onPress={onPress}>
    <Text style={[styles.text, styles.textRojo]}>{texto}</Text>
  </TouchableOpacity>
);

export default {
  BotonAzulOscuro,
  BotonAzulOscuroPequeno,
  BotonBlanco,
  BotonRojoOscuro,
};
