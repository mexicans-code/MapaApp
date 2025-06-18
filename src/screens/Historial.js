import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../assets/colors';
import { Iconos } from '../assets/iconos';
import { ip_home } from '../constants/ip';

const getColorByTipo = (tipo) => {
  switch (tipo) {
    case 'verde':
      return colors.verde;
    case 'aula':
      return colors.azulOscuro;
    case 'persona':
      return colors.amarillo;
    default:
      return colors.grisClaro;
  }
};

const getIconByTipo = (tipo) => {
  switch (tipo) {
    case 'verde':
      return <Iconos.Area size={24} />;
    case 'aula':
      return <Iconos.Edificio size={24} />;
    case 'persona':
      return <Iconos.Personal size={24} />;
    default:
      return null;
  }
};

export default function Historial() {
  const [historialData, setHistorialData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  const parseFecha = (fechaStr) => {
    const [day, month, year] = fechaStr.split('/');
    return new Date(`${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`);
  };

  // Obtener el ID del usuario desde AsyncStorage
  const obtenerIdUsuario = useCallback(async () => {
    try {
      const idUsuario = await AsyncStorage.getItem('id_user');
      if (idUsuario) {
        setUserId(idUsuario);
        return idUsuario;
      }
    } catch (error) {
      console.error('Error al obtener ID de usuario:', error);
    }
    return null;
  }, []);

  // Función para cargar datos del historial por usuario
  const cargarHistorial = useCallback(async () => {
    try {
      let idUsuario = userId;
      if (!idUsuario) {
        idUsuario = await obtenerIdUsuario();
      }
      
      if (!idUsuario) {
        console.error('No se encontró ID de usuario');
        return;
      }

      // Cambiar la URL para incluir el parámetro de usuario
      const response = await fetch(`http://${ip_home}:3008/api/historial/usuario/${idUsuario}`);
      console.log('Response:', response);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHistorialData(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setHistorialData([]); // Limpiar datos en caso de error
    }
  }, [userId, obtenerIdUsuario]);

  // Función para refrescar manualmente
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarHistorial();
    setRefreshing(false);
  }, [cargarHistorial]);

  // Cargar datos inicialmente y configurar auto-actualización
  useEffect(() => {
    const inicializar = async () => {
      await obtenerIdUsuario();
    };
    
    inicializar();
  }, [obtenerIdUsuario]);

  useEffect(() => {
    if (userId) {
      // Cargar datos inmediatamente cuando tengamos el userId
      cargarHistorial();
      
      // Configurar auto-actualización cada 5 segundos
      const interval = setInterval(() => {
        cargarHistorial();
      }, 5000); // 5000ms = 5 segundos

      // Limpiar intervalo cuando el componente se desmonte o cambie el userId
      return () => clearInterval(interval);
    }
  }, [userId, cargarHistorial]);

  const eliminarDelHistorial = async (id) => {
    try {
      const response = await fetch(`http://${ip_home}:3008/api/historial/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Recargar datos después de eliminar
        await cargarHistorial();
      } else {
        console.error('Error al eliminar registro');
      }
    } catch (error) {
      console.error('Error al eliminar registro:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={[styles.colorBar, { backgroundColor: getColorByTipo(item.tipo) }]} />
      <View style={styles.textContainer}>
        <Text style={styles.nombre} numberOfLines={2}>{item.nombre}</Text>
        <Text style={styles.detalle}>Fecha: {item.dia}</Text>
        <Text style={styles.detalle}>Hora: {item.hora}</Text>
      </View>
      <View style={styles.iconContainer}>
        {getIconByTipo(item.tipo)}
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => eliminarDelHistorial(item._id)}
      >
        <MaterialIcons name="delete" size={20} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Navegación</Text>
      {historialData.length === 0 && !refreshing ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay registros en el historial</Text>
        </View>
      ) : (
        <FlatList
          data={historialData}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.azulOscuro]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blanco,
    padding: 16,
  },
  title: {
    fontSize: 20,
    color: colors.azulOscuro,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grisMuyClaro,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  colorBar: {
    width: 8,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  nombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.grisOscuro,
  },
  detalle: {
    fontSize: 12,
    color: colors.grisMedio,
    marginTop: 2,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.grisMedio,
    textAlign: 'center',
  },
});