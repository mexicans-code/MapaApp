import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import colors from '../assets/colors';

export default function ModalGeneral({ visible, onClose, icon, title, message }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Título */}
          <Text style={styles.title}>{title}</Text>

          {/* Línea divisora */}
          <View style={styles.line} />

          {/* Contenido */}
          <View style={styles.contentContainer}>
            {icon && <Image source={icon} style={styles.icon} />}
            <Text style={styles.message}>{message}</Text>
          </View>

          {/* Línea divisora */}
          <View style={styles.line} />

          {/* Botón OK toda la anchura */}
          <TouchableOpacity onPress={onClose} style={styles.okButton}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.negroTransparente,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.blanco,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    color: colors.grisOscuro,
  },
  line: {
    height: 1,
    backgroundColor: colors.grisClaro,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.grisMedio,
  },
  okButton: {
    width: '100%',
    backgroundColor: colors.azulOscuro,
    paddingVertical: 14,
    alignItems: 'center',
  },
  okText: {
    color: colors.blanco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
