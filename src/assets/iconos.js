import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const Iconos = {
  Usuario: (props) => <Ionicons name="person-outline" {...props} />,
  Contraseña: (props) => <Ionicons name="lock-closed-outline" {...props} />,
  MostrarContraseña: (props) => <Ionicons name="eye-outline" {...props} />,
  OcultarContraseña: (props) => <Ionicons name="eye-off-outline" {...props} />,
  MenuHamburguesa: (props) => <Feather name="menu" {...props} />,

  Home: (props) => <Ionicons name="home-outline" {...props} />,
  Map : (props) => <Ionicons name="map-outline" {...props} />,
  Historial: (props) => <Ionicons name="time-outline" {...props} />,

  Filtro: (props) => <Ionicons name="options-outline" {...props} />,
  Edificio: (props) => <Ionicons name="business-outline" {...props} />,
  Area: (props) => <Ionicons name="grid-outline" {...props} />,
  Personal: (props) => <Ionicons name="people-outline" {...props} />,
  Perfil: (props) => <Ionicons name="person-outline" {...props} />,
  CerrarSesion: (props) => <Ionicons name="log-out-outline" {...props} />,

  Lupa: (props) => <Feather name="search" {...props} />,
  FlechaDerecha: (props) => <Feather name="chevron-right" {...props} />,
  FlechaAbajo: (props) => <Feather name="chevron-down" {...props} />,

  Editar: (props) => <MaterialIcons name="edit" {...props} />,
  Origen: (props) => <FontAwesome5 name="map-marker-alt" {...props} />,
};
