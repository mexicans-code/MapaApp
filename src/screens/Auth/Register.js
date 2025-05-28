import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import images from '../../assets/img/images';
import { modalesContenido } from '../../modals/ContenidoModal';
import ModalGeneral from '../../modals/ModalGeneral';
import Boton from '../components/CustomButtons';

export default function Register({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [origen, setOrigen] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState('');

  useEffect(() => {
    if (modalTipo !== '') {
      setModalVisible(true);
    }
  }, [modalTipo]);

  const registrar = async () => {
    if (!nombre || !usuario || !contraseña || !confirmarContraseña || !origen) {
      setModalTipo('errorCamposVacios');
      return;
    }
  
    if (contraseña !== confirmarContraseña) {
      setModalTipo('errorContraseñaNoCoincide');
      return;
    }
  
    try {
      console.log('Enviando registro con datos:', { nombre, usuario, contraseña, confirmarContraseña, origen });
      
      const response = await axios.post('http://10.13.9.76:3005/api/register', {
        nombre,
        usuario,
        contraseña,
        origen,
      });
      
      console.log('Respuesta completa:', response);
      console.log('Status:', response.status);
      console.log('Data:', response.data);
  
      if (response.data.success) {
        console.log('Usuario registrado exitosamente');
        setModalTipo('RegisterExitoso');
      } else {
        console.error('Error al registrar usuario:', response.data.message);
        setModalTipo('RegisterError');
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Response error:', error.response?.data);
      console.error('Status error:', error.response?.status);
      setModalTipo('RegisterError');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalTipo === 'RegisterExitoso') {
      navigation.replace('Drawer');
    }
    setModalTipo('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Crear Cuenta</Text>

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
        placeholder="Origen/Lugar"
        value={origen}
        onChangeText={setOrigen}
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

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>

      <ModalGeneral
        visible={modalVisible}
        onClose={handleModalClose}
        icon={modalesContenido[modalTipo]?.icon}
        title={modalesContenido[modalTipo]?.title}
        message={modalesContenido[modalTipo]?.message}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});