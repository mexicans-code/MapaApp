import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import colors from '../assets/colors';
import { Iconos } from '../assets/iconos';
import images from '../assets/img/images';
import { ip_school } from '../constants/ip';
import CustomButtons from './components/CustomButtons';

export default function Perfil({ navigation }) {
  const [editando, setEditando] = useState(false);

  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [origen, setOrigen] = useState('');

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const idUsuario = await AsyncStorage.getItem('id_user');
        if (!idUsuario) {
          console.warn('No se encontró id_user en AsyncStorage');
          return;
        }

        const response = await axios.get(`http://${ip_school}:3000/users/${idUsuario}`);
        const usuarioRecibido = response.data.user;

        setNombre(usuarioRecibido.nombre);
        setUsuario(usuarioRecibido.usuario);
        setOrigen(usuarioRecibido.origen || '');
        console.log('Usuario cargado:', usuarioRecibido);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    };

    obtenerUsuario();
  }, []);

  const handleCerrarSesion = () => {
    AsyncStorage.removeItem('id_user');
    navigation.replace('Welcome');
  };

  const handleEditarFoto = () => {
    console.log('Editar foto');
  };

  const handleEditarDatos = () => {
    if (editando) {
      console.log('Datos guardados:', { nombre, usuario, origen });
      // Aquí puedes agregar la lógica para enviar los cambios al servidor si lo deseas
    }
    setEditando(!editando);
  };

  const renderCampo = (icono, label, valor, onChangeText, editable) => (
    <View style={styles.infoBlock}>
      <View style={styles.iconAndText}>
        {icono}
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{label}</Text>
          {editable ? (
            <TextInput
              style={styles.valueInput}
              value={valor}
              onChangeText={onChangeText}
              placeholder={label}
              placeholderTextColor={colors.grisClaro}
            />
          ) : (
            <Text style={styles.value}>{valor}</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Image source={images.logo} style={styles.profileImage} />
        <TouchableOpacity style={styles.editPhotoIconButton} onPress={handleEditarFoto}>
          <Iconos.Editar size={28} color={colors.azulOscuro} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Perfil del Usuario</Text>

      {renderCampo(<Iconos.Usuario size={20} color={colors.azulOscuro} style={styles.icon} />, 'Nombre', nombre, setNombre, editando)}
      {renderCampo(<Iconos.Usuario size={20} color={colors.azulOscuro} style={styles.icon} />, 'Usuario', usuario, setUsuario, editando)}
      {renderCampo(<Iconos.Origen size={20} color={colors.azulOscuro} style={styles.icon} />, 'Origen', origen, setOrigen, editando)}

      <View style={{ width: '100%', marginTop: 10 }}>
        <CustomButtons.BotonAzulOscuroPequeno
          texto={editando ? 'Guardar datos' : 'Editar datos'}
          onPress={handleEditarDatos}
        />
      </View>

      <View style={{ height: 20 }} />

      <CustomButtons.BotonRojoOscuro
        texto="Cerrar sesión"
        onPress={handleCerrarSesion}
        style={{ marginTop: 0 }}  
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blanco,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  photoContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: colors.azulOscuro,
  },
  editPhotoIconButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: colors.blanco,
    borderRadius: 18,
    padding: 6,
    elevation: 5,
    shadowColor: colors.grisOscuro,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.azulOscuro,
    marginBottom: 30,
  },
  infoBlock: {
    backgroundColor: colors.blanco,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: colors.azulOscuro,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.azulOscuro,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: colors.grisOscuro,
  },
  valueInput: {
    fontSize: 16,
    color: colors.grisOscuro,
    borderBottomWidth: 1,
    borderBottomColor: colors.grisClaro,
    paddingVertical: 4,
  },
});
