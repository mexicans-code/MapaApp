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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalTipo !== '') {
      setModalVisible(true);
    }
  }, [modalTipo]);

  const registrar = async () => {
    // Validación de campos vacíos
    if (!nombre.trim() || !usuario.trim() || !contraseña.trim() || !confirmarContraseña.trim() || !origen.trim()) {
      setModalTipo('errorCamposVacios');
      return;
    }
  
    // Validación de contraseñas
    if (contraseña !== confirmarContraseña) {   
      setModalTipo('errorContraseñaNoCoincide');
      return;
    }

    // Validación de longitud de contraseña
    if (contraseña.length < 6) {
      setModalTipo('errorContraseñaCorta');
      return;
    }

    setLoading(true);
  
    try {
      console.log('Enviando registro con datos:', { 
        nombre: nombre.trim(), 
        usuario: usuario.trim(), 
        origen: origen.trim() 
      });
      
      const response = await axios.post(`http://192.168.100.96:3000/api/auth/register`, {
        nombre: nombre.trim(),
        usuario: usuario.trim(),
        contraseña: contraseña,
        origen: origen.trim(),
      });
      
      console.log('Respuesta del registro:', response.data);
  
      if (response.data.success) {
        console.log('Usuario registrado exitosamente:', response.data.user?.nombre || nombre);
        setModalTipo('RegisterExitoso');
        
        // Redirigir al login después del registro exitoso
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
        
      } else {
        console.error('Error al registrar usuario:', response.data.message);
        setModalTipo('RegisterError');
      }
    } catch (error) {
      console.error('Error completo:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
        
        if (error.response.status === 409) {
          setModalTipo('UsuarioYaExiste');
        } else if (error.response.status === 400) {
          setModalTipo('DatosInvalidos');
        } else {
          setModalTipo('RegisterError');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        setModalTipo('RegisterErrorConexion');
      } else {
        console.error('Request setup error:', error.message);
        setModalTipo('RegisterError');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
        autoCorrect={false}
        editable={!loading}
      />
      
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
        placeholder="Origen/Lugar"
        value={origen}
        onChangeText={setOrigen}
        autoCapitalize="words"
        autoCorrect={false}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmarContraseña}
        onChangeText={setConfirmarContraseña}
        editable={!loading}
      />

      <View style={styles.buttonContainer}>
        <Boton.BotonAzulOscuroPequeno 
          texto={loading ? "Registrando..." : "Registrar"} 
          onPress={registrar}
          disabled={loading}
        />
      </View>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
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
    textAlign: 'center',
  },
});