import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import colors from '../assets/colors';
import images from '../assets/img/images';
import Boton from './components/CustomButtons';

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Animatable.Text
        animation="fadeInDown"
        delay={300}
        style={styles.welcome}
      >
        Bienvenido
      </Animatable.Text>

      <Animatable.Image
        animation="fadeInDown"
        delay={800}
        source={images.logo}
        style={styles.logo}
        resizeMode="contain"
      />

      <Animatable.View animation="fadeInUp" delay={1300} style={styles.buttonContainer}>
        <Boton.BotonBlanco texto="Iniciar sin cuenta" onPress={() => navigation.replace('Drawer')} />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={1800}>
        <View style={styles.row}>
          <Text style={styles.textWhite}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Iniciar sesion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.textWhite}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: colors.azulOscuro,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.blanco,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  buttonContainer: {
    marginVertical: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  textWhite: {
    color: colors.blanco,
  },
  link: {
    color: colors.blanco,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
