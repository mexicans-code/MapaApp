import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import images from '../../assets/img/images';
import { modalesContenido } from '../../modals/ContenidoModal';
import ModalGeneral from '../../modals/ModalGeneral';
import Boton from '../components/CustomButtons';


export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalTipo !== '') {
      setModalVisible(true);
    }
  }, [modalTipo]);

  const handleLogin = async () => {
    // Validación de campos vacíos
    if (usuario.trim() === '' || contraseña.trim() === '') {
      setModalTipo('errorCamposVacios');
      return;
    }

    setLoading(true);

    try {
      console.log('Intentando login con usuario:', usuario);
      
      const response = await axios.post('http://10.13.9.76:3005/api/login', {
        usuario: usuario.trim(),
        contraseña: contraseña
      });

      console.log('Respuesta del login:', response.data);

      if (response.data.success) {
        console.log('Login exitoso para:', response.data.user.nombre);
        
        await AsyncStorage.setItem('id_user', response.data.user.id);
        console.log('ID de usuario guardado:', response.data.user.id);
        setModalTipo('LoginExitoso');
        
        setTimeout(() => {
          navigation.replace('Drawer');
        }, 1500);
        
      } else {
        console.error('Error en login:', response.data.message);
        setModalTipo('LoginError');
      }

    } catch (error) {
      console.error('Error completo:', error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
        
        if (error.response.status === 401) {
          setModalTipo('LoginCredencialesIncorrectas');
        } else {
          setModalTipo('LoginError');
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        console.error('No response received:', error.request);
        setModalTipo('LoginErrorConexion');
      } else {
        // Algo pasó al configurar la petición
        console.error('Request setup error:', error.message);
        setModalTipo('LoginError');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setModalTipo('');
  };

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
        editable={!loading}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Boton.BotonAzulOscuroPequeno 
          texto={loading ? "Iniciando..." : "Iniciar sesión"} 
          onPress={handleLogin}
          disabled={loading}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
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
  forgotText: {
    textAlign: 'right',
    color: '#007bff',
    marginBottom: 15,
    textDecorationLine: 'underline',
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});