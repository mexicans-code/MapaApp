import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import ModalGeneral from '../../modals/ModalGeneral';
import { modalesContenido } from '../../modals/ContenidoModal';
import Boton from '../components/CustomButtons';

export default function Register ({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState('');

  useEffect(() => {
    if (modalTipo !== '') {
      setModalVisible(true);
    }
  }, [modalTipo]);

  const registrar = () => {
    if (!nombre || !usuario || !contraseña || !confirmarContraseña) {
      setModalTipo('errorCamposVacios');
      return;
    }

    if (contraseña !== confirmarContraseña) {
      setModalTipo('errorContraseñaNoCoincide');
      return;
    }

    // Aquí iría la lógica real de Register 
    setModalTipo('Register Exitoso');
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalTipo === 'RegisterExitoso') {
      navigation.replace('Drawer');
    }
    setModalTipo('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmarContraseña}
        onChangeText={setConfirmarContraseña}
      />

      <View style={styles.buttonContainer}>
        <Boton.BotonAzulOscuroPequeno texto="Registrar" onPress={registrar} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>

      {/* Modal General */}
      <ModalGeneral
        visible={modalVisible}
        onClose={handleModalClose}
        icon={modalesContenido[modalTipo]?.icon}
        title={modalesContenido[modalTipo]?.title}
        message={modalesContenido[modalTipo]?.message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
   buttonContainer: {
    marginBottom: 20,
  },
  loginText: {
    textAlign: 'center',
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
