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
    const [currentDepartamento, setCurrentDepartamento] = useState({
        _id: '',
        id: '',
        nombre: '',
        posicion: {
            latitude: '',
            longitude: ''
        }
    });

    // Simulación de datos iniciales
    useEffect(() => {
        loadDepartamentos();
    }, []);

    const loadDepartamentos = () => {
        setLoading(true);
        // Aquí conectarías con tu API
        setTimeout(() => {
            const mockData = [
                {
                    _id: '6832c259f8f90e35e6c5acaf',
                    id: '2',
                    nombre: 'Caseta de Control 2: Acceso a Estacionamiento 2',
                    posicion: {
                        latitude: 20.65351,
                        longitude: -100.4061
                    }
                },
                {
                    _id: '6832c259f8f90e35e6c5acb0',
                    id: '1',
                    nombre: 'Caseta de Control 1: Acceso Principal',
                    posicion: {
                        latitude: 20.65400,
                        longitude: -100.4050
                    }
                }
            ];
            setDepartamentos(mockData);
            setLoading(false);
        }, 1000);
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
            setCurrentDepartamento(departamento);
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
        if (!currentDepartamento.posicion.latitude) {
            Alert.alert('Error', 'La latitud es requerida');
            return false;
        }
        if (!currentDepartamento.posicion.longitude) {
            Alert.alert('Error', 'La longitud es requerida');
            return false;
        }
        return true;
    };

    const saveDepartamento = () => {
        if (!validateForm()) return;

        setLoading(true);
        
        // Aquí harías la llamada a tu API
        setTimeout(() => {
            if (editMode) {
                // Actualizar departamento existente
                setDepartamentos(prev => 
                    prev.map(dep => 
                        dep._id === currentDepartamento._id ? currentDepartamento : dep
                    )
                );
                Alert.alert('Éxito', 'Departamento actualizado correctamente');
            } else {
                // Crear nuevo departamento
                const newDepartamento = {
                    ...currentDepartamento,
                    _id: Date.now().toString(), // ID temporal
                    posicion: {
                        latitude: parseFloat(currentDepartamento.posicion.latitude),
                        longitude: parseFloat(currentDepartamento.posicion.longitude)
                    }
                };
                setDepartamentos(prev => [...prev, newDepartamento]);
                Alert.alert('Éxito', 'Departamento creado correctamente');
            }
            setLoading(false);
            closeModal();
        }, 1000);
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
                    onPress: () => {
                        setLoading(true);
                        // Aquí harías la llamada a tu API
                        setTimeout(() => {
                            setDepartamentos(prev => 
                                prev.filter(dep => dep._id !== departamento._id)
                            );
                            setLoading(false);
                            Alert.alert('Éxito', 'Departamento eliminado correctamente');
                        }, 1000);
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
                    >
                        <Text style={styles.editButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteDepartamento(item)}
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
                    style={styles.addButton}
                    onPress={() => openModal()}
                >
                    <Text style={styles.addButtonText}>+ Nuevo Departamento</Text>
                </TouchableOpacity>
            </View>

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
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay departamentos registrados</Text>
                            <Text style={styles.emptySubtext}>Agrega el primer departamento</Text>
                        </View>
                    )}
                />
            )}

            {/* Modal */}
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
                                />
                            </View>

                            <Text style={styles.sectionTitle}>Ubicación GPS</Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Latitud *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentDepartamento.posicion.latitude.toString()}
                                    onChangeText={(text) => 
                                        setCurrentDepartamento(prev => ({
                                            ...prev,
                                            posicion: { ...prev.posicion, latitude: text }
                                        }))
                                    }
                                    placeholder="Ej: 20.65351"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Longitud *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentDepartamento.posicion.longitude.toString()}
                                    onChangeText={(text) => 
                                        setCurrentDepartamento(prev => ({
                                            ...prev,
                                            posicion: { ...prev.posicion, longitude: text }
                                        }))
                                    }
                                    placeholder="Ej: -100.4061"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeModal}
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