import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import images from '../assets/img/images';
import colors from '../assets/colors';
import CustomButtons from './components/CustomButtons';
import { Iconos } from '../assets/iconos';

export default function Perfil({ navigation }) {
  const [editando, setEditando] = useState(false);

  const [nombre, setNombre] = useState('Juan Pérez');
  const [usuario, setUsuario] = useState('juanp');
  const [origen, setOrigen] = useState('Ciudad de México');

  const handleEditarFoto = () => {
    console.log('Editar foto');
  };

  const handleEditarDatos = () => {
    if (editando) {
      // Aquí puedes guardar los datos en tu backend si lo deseas
      console.log('Datos guardados:', { nombre, usuario, origen });
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
        onPress={() => navigation.replace('Welcome')}
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
