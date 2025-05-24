import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Boton from '../components/CustomButtons';

export default function ForgotPassword({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const enviarCodigo = () => {
    if (usuario === '' || correo === '') {
      Alert.alert('Error', 'Completa los campos de usuario y correo.');
      return;
    }
    Alert.alert('Código enviado', 'Revisa tu correo.');
    setCodigoEnviado(true);
  };

  const cambiarContrasena = () => {
    if (codigo === '' || nuevaContrasena === '' || confirmarContrasena === '') {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    Alert.alert('Contraseña cambiada', 'Ahora puedes iniciar sesión con tu nueva contraseña.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />

      {!codigoEnviado ? (
        <Boton.BotonAzulOscuroPequeno texto="Enviar codigo" onPress={enviarCodigo} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Código de verificación"
            value={codigo}
            onChangeText={setCodigo}
          />
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            secureTextEntry
            value={nuevaContrasena}
            onChangeText={setNuevaContrasena}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar nueva contraseña"
            secureTextEntry
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
          />
          <Button title="Cambiar contraseña" onPress={cambiarContrasena} />
        </>
      )}

      <View style={{ marginTop: 20 }}>
        <Boton.BotonAzulOscuroPequeno texto="Volver a welcme" onPress={() => navigation.navigate('Welcome')} />
      </View>
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
});
