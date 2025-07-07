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
import Mapa2Mejorado from './src/screens/Mapa2Mejorado';
import Perfil from './src/screens/Perfil';

import { Iconos } from './src/assets/iconos';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Encabezado del usuario */}
      <View style={styles.drawerHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>U</Text>
        </View>
        <Text style={styles.userName}>Bienvenido</Text>
        <Text style={styles.userEmail}>usuario@example.com</Text>
      </View>

      {/* Menú principal */}
      <DrawerItem
        label="Inicio"
        icon={({ size, color }) => <Iconos.Home size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Home'); props.navigation.closeDrawer(); }}
      />

      <DrawerItem
        label="Mapa"
        icon={({ size, color }) => <Iconos.Map size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Mapa2Mejorado'); props.navigation.closeDrawer(); }}
      />

      <DrawerItem
        label="Historial"
        icon={({ size, color }) => <Iconos.Historial size={size} color={color} />}
        onPress={() => { props.navigation.navigate('Historial'); props.navigation.closeDrawer(); }}
      />

      {/* Línea divisoria */}
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { width: '85%' },
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitle: '',
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Historial" component={Historial} />
      <Drawer.Screen name="Filtro" component={Filtro} />
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Mapa2Mejorado" component={Mapa2Mejorado} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1976D2',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 13,
    color: '#e0e0e0',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  sectionTitle: {
    marginLeft: 20,
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 14,
    color: '#555',
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
