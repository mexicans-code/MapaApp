import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ForgotPassword from './src/screens/Auth/ForgotPassword';
import Login from './src/screens/Auth/Login';
import Register from './src/screens/Auth/Register';
import Welcome from './src/screens/Welcome';

import Filtro from './src/screens/Filtro';
import Historial from './src/screens/Historial';
import Home from './src/screens/Home';
import Map from './src/screens/Map';
import Perfil from './src/screens/Perfil';

import { Iconos } from './src/assets/iconos';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>

      {/* Sección: Main */}
      <DrawerItem
        label="Inicio"
        icon={({ size, color }) => <Iconos.Home size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Home'); props.navigation.closeDrawer(); }}
      />
      <DrawerItem
        label="Map"
        icon={({ size, color }) => <Iconos.Map  size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Map'); props.navigation.closeDrawer(); }}
      />
      <DrawerItem
        label="Historial"
        icon={({ size, color }) => <Iconos.Historial size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Historial'); props.navigation.closeDrawer(); }}
      />

      {/* Línea divisoria y título: Buscar */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>A donde quieres ir?</Text>

      <DrawerItem
        label="Edificio"
        icon={({ size, color }) => <Iconos.Edificio size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Filtro'); props.navigation.closeDrawer(); }}
      />
      <DrawerItem
        label="Área"
        icon={({ size, color }) => <Iconos.Area size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Filtro'); props.navigation.closeDrawer(); }}
      />
      <DrawerItem
        label="Personal"
        icon={({ size, color }) => <Iconos.Personal size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Filtro'); props.navigation.closeDrawer(); }}
      />

      {/* Línea divisoria y título: Tú */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Tú</Text>

      <DrawerItem
        label="Perfil"
        icon={({ size, color }) => <Iconos.Perfil size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Perfil'); props.navigation.closeDrawer(); }}
      />
      <DrawerItem
        label="Cerrar sesión"
        icon={({ size, color }) => <Iconos.CerrarSesion size={size} color={color} />}
        onPress={() => { props.navigation.replace('Welcome'); props.navigation.closeDrawer(); }}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: '90%' },
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitle: '',
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Map" component={Map} />
      <Drawer.Screen name="Historial" component={Historial} />
      <Drawer.Screen name="Filtro" component={Filtro} />
      <Drawer.Screen name="Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    marginLeft: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#444',
    fontSize: 14,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
