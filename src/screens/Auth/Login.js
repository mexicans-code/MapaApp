import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import ModalGeneral from '../../modals/ModalGeneral';
import { modalesContenido } from '../../modals/ContenidoModal';
import Boton from '../components/CustomButtons';

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = () => {
    if (usuario.trim() === '' || contrasena.trim() === '') {
      setModalVisible(true);
      return;
    }

    navigation.replace('Drawer');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

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
        value={contrasena}
        onChangeText={setContrasena}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Boton.BotonAzulOscuroPequeno texto="Iniciar sesión" onPress={handleLogin} />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

      <ModalGeneral
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        icon={modalesContenido.errorCamposVacios.icon}
        title={modalesContenido.errorCamposVacios.title}
        message={modalesContenido.errorCamposVacios.message}
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
  forgotText: {
    textAlign: 'right',
    color: '#007bff',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
