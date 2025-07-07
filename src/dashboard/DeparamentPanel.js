import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styles from './styles/DepartamentPanel';

const DepartamentPanel = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const [currentDepartamento, setCurrentDepartamento] = useState({
        _id: '',
        id: '',
        nombre: '',
        posicion: {
            latitude: '',
            longitude: ''
        }
    });

    useEffect(() => {
        checkConnection();
        loadDepartamentos();
    }, []);

    const checkConnection = async () => {
        try {
            const response = await fetch(`http://192.168.100.96:3000/api/destinos?test=simple`);
            if (response.ok) {
                setConnectionStatus('connected');
            } else {
                setConnectionStatus('error');
            }
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            setConnectionStatus('error');
        }
    };

    const loadDepartamentos = async () => {
        console.log('📥 Cargando departamentos...');
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.100.96:3000/api/destinos`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('📊 Respuesta del servidor:', result);
            
            if (result.success) {
                console.log(`✅ Departamentos cargados: ${result.count}`);
                setDepartamentos(result.data || []);
                setConnectionStatus('connected');
                
                if (result.count === 0) {
                    console.log('⚠️ No hay departamentos disponibles');
                }
            } else {
                console.error('❌ Error en la respuesta:', result.message);
                Alert.alert('Error', result.message || 'No se pudieron cargar los departamentos');
                setConnectionStatus('error');
            }
        } catch (error) {
            console.error('❌ Error al cargar departamentos:', error);
            Alert.alert('Error', 'Error de conexión al servidor');
            setConnectionStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const createSampleData = async () => {
        console.log('🌱 Creando datos de prueba...');
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.100.96:3000/api/destinos?seed=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Datos de prueba creados');
                Alert.alert('Éxito', 'Datos de prueba creados correctamente');
                loadDepartamentos(); // Recargar la lista
            } else {
                console.error('❌ Error al crear datos:', result.message);
                Alert.alert('Error', result.message || 'Error al crear datos de prueba');
            }
        } catch (error) {
            console.error('❌ Error al crear datos de prueba:', error);
            Alert.alert('Error', 'Error de conexión al servidor');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCurrentDepartamento({
            _id: '',
            id: '',
            nombre: '',
            posicion: {
                latitude: '',
                longitude: ''
            }
        });
        setEditMode(false);
    };

    const openModal = (departamento = null) => {
        if (departamento) {
            setCurrentDepartamento({
                ...departamento,
                posicion: {
                    latitude: departamento.posicion.latitude.toString(),
                    longitude: departamento.posicion.longitude.toString()
                }
            });
            setEditMode(true);
        } else {
            resetForm();
        }
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        resetForm();
    };

    const validateForm = () => {
        if (!currentDepartamento.id.trim()) {
            Alert.alert('Error', 'El ID es requerido');
            return false;
        }
        if (!currentDepartamento.nombre.trim()) {
            Alert.alert('Error', 'El nombre es requerido');
            return false;
        }
        if (!currentDepartamento.posicion.latitude.trim()) {
            Alert.alert('Error', 'La latitud es requerida');
            return false;
        }
        if (!currentDepartamento.posicion.longitude.trim()) {
            Alert.alert('Error', 'La longitud es requerida');
            return false;
        }
        
        // Validar que sean números válidos
        const lat = parseFloat(currentDepartamento.posicion.latitude);
        const lng = parseFloat(currentDepartamento.posicion.longitude);
        
        if (isNaN(lat) || isNaN(lng)) {
            Alert.alert('Error', 'Las coordenadas deben ser números válidos');
            return false;
        }
        
        if (lat < -90 || lat > 90) {
            Alert.alert('Error', 'La latitud debe estar entre -90 y 90');
            return false;
        }
        
        if (lng < -180 || lng > 180) {
            Alert.alert('Error', 'La longitud debe estar entre -180 y 180');
            return false;
        }
        
        return true;
    };

    const saveDepartamento = async () => {
        if (!validateForm()) return;

        console.log('💾 Guardando departamento:', currentDepartamento);
        setLoading(true);
        
        try {
            const departamentoData = {
                id: currentDepartamento.id,
                nombre: currentDepartamento.nombre,
                posicion: {
                    latitude: parseFloat(currentDepartamento.posicion.latitude),
                    longitude: parseFloat(currentDepartamento.posicion.longitude)
                }
            };

            let response;
            
            if (editMode) {
                console.log('📝 Actualizando departamento ID:', currentDepartamento._id);
                response = await fetch(`http://192.168.100.96:3000/api/destinos/${currentDepartamento._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(departamentoData)
                });
            } else {
                console.log('➕ Creando nuevo departamento');
                response = await fetch(`http://192.168.100.96:3000/api/destinos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(departamentoData)
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('📋 Resultado:', result);
            
            if (result.success) {
                console.log('✅ Departamento guardado exitosamente');
                Alert.alert(
                    'Éxito', 
                    editMode ? 'Departamento actualizado correctamente' : 'Departamento creado correctamente'
                );
                closeModal();
                loadDepartamentos(); // Recargar la lista
            } else {
                console.error('❌ Error al guardar:', result.message);
                Alert.alert('Error', result.message || 'Error al guardar el departamento');
            }
        } catch (error) {
            console.error('❌ Error al guardar departamento:', error);
            Alert.alert('Error', 'Error de conexión al servidor');
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartamento = (departamento) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de eliminar "${departamento.nombre}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('🗑️ Eliminando departamento:', departamento._id);
                        setLoading(true);
                        try {
                            const response = await fetch(`http://192.168.100.96:3000/api/destinos/${departamento._id}`, {
                                method: 'DELETE'
                            });
                            
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            
                            const result = await response.json();
                            
                            if (result.success) {
                                console.log('✅ Departamento eliminado');
                                Alert.alert('Éxito', 'Departamento eliminado correctamente');
                                loadDepartamentos(); // Recargar la lista
                            } else {
                                console.error('❌ Error al eliminar:', result.message);
                                Alert.alert('Error', result.message || 'Error al eliminar el departamento');
                            }
                        } catch (error) {
                            console.error('❌ Error al eliminar departamento:', error);
                            Alert.alert('Error', 'Error de conexión al servidor');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderDepartamento = ({ item }) => (
        <View style={styles.departamentoCard}>
            <View style={styles.cardHeader}>
                <View style={styles.idBadge}>
                    <Text style={styles.idText}>#{item.id}</Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => openModal(item)}
                        disabled={loading}
                    >
                        <Text style={styles.editButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteDepartamento(item)}
                        disabled={loading}
                    >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <Text style={styles.departamentoName}>{item.nombre}</Text>
            
            <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>📍 Ubicación:</Text>
                <Text style={styles.locationText}>
                    Lat: {item.posicion.latitude}, Long: {item.posicion.longitude}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#1565C0" barStyle="light-content" />
            
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.headerTitle}>Sistema Universitario</Text>
                            <Text style={styles.headerSubtitle}>Panel de Administración</Text>
                        </View>
                    </View>
                    <View style={styles.profileSection}>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>Ricardo</Text>
                            <Text style={styles.profileRole}>Administrador</Text>
                        </View>
                        <View style={styles.profileIcon}>
                            <Text style={styles.profileText}>👤</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={[styles.addButton, (loading || connectionStatus !== 'connected') && styles.disabledButton]}
                    onPress={() => openModal()}
                    disabled={loading || connectionStatus !== 'connected'}
                >
                    <Text style={styles.addButtonText}>+ Nuevo Departamento</Text>
                </TouchableOpacity>
            </View>

            {/* Connection Status */}
            {connectionStatus === 'error' && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>❌ Error de conexión con el servidor</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadDepartamentos}
                        disabled={loading}
                    >
                        <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Departments List */}
            {loading && !modalVisible ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1565C0" />
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            ) : (
                <FlatList
                    data={departamentos}
                    renderItem={renderDepartamento}
                    keyExtractor={(item) => item._id}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={loadDepartamentos}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay departamentos registrados</Text>
                            <Text style={styles.emptySubtext}>
                                {connectionStatus === 'connected' 
                                    ? 'Agrega el primer departamento o crea datos de prueba'
                                    : 'Verifica la conexión con el servidor'
                                }
                            </Text>
                            {connectionStatus === 'connected' && (
                                <TouchableOpacity
                                    style={styles.sampleDataButton}
                                    onPress={createSampleData}
                                    disabled={loading}
                                >
                                    <Text style={styles.sampleDataButtonText}>
                                        🌱 Crear Datos de Prueba
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            )}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>
                                {editMode ? 'Editar Departamento' : 'Nuevo Departamento'}
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>ID del Departamento *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentDepartamento.id}
                                    onChangeText={(text) => 
                                        setCurrentDepartamento(prev => ({ ...prev, id: text }))
                                    }
                                    placeholder="Ej: 3"
                                    keyboardType="numeric"
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Nombre del Departamento *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={currentDepartamento.nombre}
                                    onChangeText={(text) => 
                                        setCurrentDepartamento(prev => ({ ...prev, nombre: text }))
                                    }
                                    placeholder="Ej: Caseta de Control 3: Acceso Sur"
                                    multiline
                                    numberOfLines={2}
                                    editable={!loading}
                                />
                            </View>

                            <Text style={styles.sectionTitle}>Ubicación GPS</Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Latitud *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentDepartamento.posicion.latitude}
                                    onChangeText={(text) => 
                                        setCurrentDepartamento(prev => ({
                                            ...prev,
                                            posicion: { ...prev.posicion, latitude: text }
                                        }))
                                    }
                                    placeholder="Ej: 20.65351"
                                    keyboardType="numeric"
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Longitud *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentDepartamento.posicion.longitude}
                                    onChangeText={(text) => 
                                        setCurrentDepartamento(prev => ({
                                            ...prev,
                                            posicion: { ...prev.posicion, longitude: text }
                                        }))
                                    }
                                    placeholder="Ej: -100.4061"
                                    keyboardType="numeric"
                                    editable={!loading}
                                />
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeModal}
                                    disabled={loading}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={saveDepartamento}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>
                                            {editMode ? 'Actualizar' : 'Guardar'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DepartamentPanel;