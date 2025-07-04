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
import styles from './styles/PersonalPanel'; // Asume que crearás este archivo de estilos

const PersonalPanel = () => {
    const [personal, setPersonal] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentPersonal, setCurrentPersonal] = useState({
        _id: '',
        numeroEmpleado: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        telefono: '',
        departamento: '',
        cargo: '',
        fechaIngreso: '',
        estatus: 'activo' // activo, inactivo
    });

    // Simulación de datos iniciales
    useEffect(() => {
        loadPersonal();
    }, []);

    const loadPersonal = () => {
        setLoading(true);
        // Aquí conectarías con tu API
        setTimeout(() => {
            const mockData = [
                {
                    _id: '6832c259f8f90e35e6c5acb1',
                    numeroEmpleado: '001',
                    nombre: 'María Elena',
                    apellidoPaterno: 'García',
                    apellidoMaterno: 'López',
                    email: 'maria.garcia@universidad.edu',
                    telefono: '4421234567',
                    departamento: 'Ingeniería',
                    cargo: 'Profesora Titular',
                    fechaIngreso: '2020-01-15',
                    estatus: 'activo'
                },
                {
                    _id: '6832c259f8f90e35e6c5acb2',
                    numeroEmpleado: '002',
                    nombre: 'Carlos',
                    apellidoPaterno: 'Rodríguez',
                    apellidoMaterno: 'Hernández',
                    email: 'carlos.rodriguez@universidad.edu',
                    telefono: '4429876543',
                    departamento: 'Matemáticas',
                    cargo: 'Profesor Investigador',
                    fechaIngreso: '2019-08-20',
                    estatus: 'activo'
                },
                {
                    _id: '6832c259f8f90e35e6c5acb3',
                    numeroEmpleado: '003',
                    nombre: 'Ana',
                    apellidoPaterno: 'Martínez',
                    apellidoMaterno: 'Sánchez',
                    email: 'ana.martinez@universidad.edu',
                    telefono: '4425551234',
                    departamento: 'Psicología',
                    cargo: 'Profesora Asociada',
                    fechaIngreso: '2021-03-10',
                    estatus: 'inactivo'
                }
            ];
            setPersonal(mockData);
            setLoading(false);
        }, 1000);
    };

    const resetForm = () => {
        setCurrentPersonal({
            _id: '',
            numeroEmpleado: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            email: '',
            telefono: '',
            departamento: '',
            cargo: '',
            fechaIngreso: '',
            estatus: 'activo'
        });
        setEditMode(false);
    };

    const openModal = (personalItem = null) => {
        if (personalItem) {
            setCurrentPersonal(personalItem);
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
        if (!currentPersonal.numeroEmpleado.trim()) {
            Alert.alert('Error', 'El número de empleado es requerido');
            return false;
        }
        if (!currentPersonal.nombre.trim()) {
            Alert.alert('Error', 'El nombre es requerido');
            return false;
        }
        if (!currentPersonal.apellidoPaterno.trim()) {
            Alert.alert('Error', 'El apellido paterno es requerido');
            return false;
        }
        if (!currentPersonal.email.trim()) {
            Alert.alert('Error', 'El email es requerido');
            return false;
        }
        if (!currentPersonal.departamento.trim()) {
            Alert.alert('Error', 'El departamento es requerido');
            return false;
        }
        if (!currentPersonal.cargo.trim()) {
            Alert.alert('Error', 'El cargo es requerido');
            return false;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(currentPersonal.email)) {
            Alert.alert('Error', 'El formato del email no es válido');
            return false;
        }

        return true;
    };

    const savePersonal = () => {
        if (!validateForm()) return;

        setLoading(true);
        
        // Aquí harías la llamada a tu API
        setTimeout(() => {
            if (editMode) {
                // Actualizar personal existente
                setPersonal(prev => 
                    prev.map(p => 
                        p._id === currentPersonal._id ? currentPersonal : p
                    )
                );
                Alert.alert('Éxito', 'Personal actualizado correctamente');
            } else {
                // Crear nuevo personal
                const newPersonal = {
                    ...currentPersonal,
                    _id: Date.now().toString() // ID temporal
                };
                setPersonal(prev => [...prev, newPersonal]);
                Alert.alert('Éxito', 'Personal creado correctamente');
            }
            setLoading(false);
            closeModal();
        }, 1000);
    };

    const deletePersonal = (personalItem) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de eliminar a "${personalItem.nombre} ${personalItem.apellidoPaterno}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        setLoading(true);
                        // Aquí harías la llamada a tu API
                        setTimeout(() => {
                            setPersonal(prev => 
                                prev.filter(p => p._id !== personalItem._id)
                            );
                            setLoading(false);
                            Alert.alert('Éxito', 'Personal eliminado correctamente');
                        }, 1000);
                    }
                }
            ]
        );
    };

    const toggleEstatus = (personalItem) => {
        const nuevoEstatus = personalItem.estatus === 'activo' ? 'inactivo' : 'activo';
        const accion = nuevoEstatus === 'activo' ? 'activar' : 'desactivar';
        
        Alert.alert(
            'Cambiar estatus',
            `¿Estás seguro de ${accion} a "${personalItem.nombre} ${personalItem.apellidoPaterno}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        setLoading(true);
                        setTimeout(() => {
                            setPersonal(prev => 
                                prev.map(p => 
                                    p._id === personalItem._id 
                                        ? { ...p, estatus: nuevoEstatus }
                                        : p
                                )
                            );
                            setLoading(false);
                            Alert.alert('Éxito', `Personal ${accion === 'activar' ? 'activado' : 'desactivado'} correctamente`);
                        }, 500);
                    }
                }
            ]
        );
    };

    const renderPersonal = ({ item }) => (
        <View style={[styles.personalCard, item.estatus === 'inactivo' && styles.inactiveCard]}>
            <View style={styles.cardHeader}>
                <View style={styles.empleadoBadge}>
                    <Text style={styles.empleadoText}>#{item.numeroEmpleado}</Text>
                </View>
                <View style={[styles.statusBadge, item.estatus === 'activo' ? styles.activeBadge : styles.inactiveBadge]}>
                    <Text style={styles.statusText}>
                        {item.estatus === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                    </Text>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.statusButton}
                        onPress={() => toggleEstatus(item)}
                    >
                        <Text style={styles.statusButtonText}>
                            {item.estatus === 'activo' ? '⏸️' : '▶️'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => openModal(item)}
                    >
                        <Text style={styles.editButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deletePersonal(item)}
                    >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <Text style={styles.personalName}>
                {item.nombre} {item.apellidoPaterno} {item.apellidoMaterno}
            </Text>
            
            <View style={styles.personalInfo}>
                <Text style={styles.infoLabel}>🏢 Departamento:</Text>
                <Text style={styles.infoText}>{item.departamento}</Text>
            </View>
            
            <View style={styles.personalInfo}>
                <Text style={styles.infoLabel}>👔 Cargo:</Text>
                <Text style={styles.infoText}>{item.cargo}</Text>
            </View>
            
            <View style={styles.personalInfo}>
                <Text style={styles.infoLabel}>📧 Email:</Text>
                <Text style={styles.infoText}>{item.email}</Text>
            </View>
            
            {item.telefono && (
                <View style={styles.personalInfo}>
                    <Text style={styles.infoLabel}>📱 Teléfono:</Text>
                    <Text style={styles.infoText}>{item.telefono}</Text>
                </View>
            )}
            
            <View style={styles.personalInfo}>
                <Text style={styles.infoLabel}>📅 Fecha de Ingreso:</Text>
                <Text style={styles.infoText}>{item.fechaIngreso}</Text>
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
                            <Text style={styles.headerSubtitle}>Gestión de Personal Académico</Text>
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

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{personal.filter(p => p.estatus === 'activo').length}</Text>
                    <Text style={styles.statLabel}>Activos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{personal.filter(p => p.estatus === 'inactivo').length}</Text>
                    <Text style={styles.statLabel}>Inactivos</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{personal.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>

            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => openModal()}
                >
                    <Text style={styles.addButtonText}>+ Nuevo Personal</Text>
                </TouchableOpacity>
            </View>

            {/* Personal List */}
            {loading && !modalVisible ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1565C0" />
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            ) : (
                <FlatList
                    data={personal}
                    renderItem={renderPersonal}
                    keyExtractor={(item) => item._id}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay personal registrado</Text>
                            <Text style={styles.emptySubtext}>Agrega el primer miembro del personal</Text>
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
                                {editMode ? 'Editar Personal' : 'Nuevo Personal'}
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Número de Empleado *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.numeroEmpleado}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, numeroEmpleado: text }))
                                    }
                                    placeholder="Ej: 001"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Nombre *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.nombre}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, nombre: text }))
                                    }
                                    placeholder="Ej: María Elena"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Apellido Paterno *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.apellidoPaterno}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, apellidoPaterno: text }))
                                    }
                                    placeholder="Ej: García"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Apellido Materno</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.apellidoMaterno}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, apellidoMaterno: text }))
                                    }
                                    placeholder="Ej: López"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Email *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.email}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, email: text }))
                                    }
                                    placeholder="Ej: maria.garcia@universidad.edu"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Teléfono</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.telefono}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, telefono: text }))
                                    }
                                    placeholder="Ej: 4421234567"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Departamento *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.departamento}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, departamento: text }))
                                    }
                                    placeholder="Ej: Ingeniería"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Cargo *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.cargo}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, cargo: text }))
                                    }
                                    placeholder="Ej: Profesor Titular"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Fecha de Ingreso</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentPersonal.fechaIngreso}
                                    onChangeText={(text) => 
                                        setCurrentPersonal(prev => ({ ...prev, fechaIngreso: text }))
                                    }
                                    placeholder="YYYY-MM-DD"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Estatus</Text>
                                <View style={styles.radioGroup}>
                                    <TouchableOpacity
                                        style={[styles.radioOption, currentPersonal.estatus === 'activo' && styles.radioSelected]}
                                        onPress={() => setCurrentPersonal(prev => ({ ...prev, estatus: 'activo' }))}
                                    >
                                        <Text style={styles.radioText}>🟢 Activo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.radioOption, currentPersonal.estatus === 'inactivo' && styles.radioSelected]}
                                        onPress={() => setCurrentPersonal(prev => ({ ...prev, estatus: 'inactivo' }))}
                                    >
                                        <Text style={styles.radioText}>🔴 Inactivo</Text>
                                    </TouchableOpacity>
                                </View>
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
                                    onPress={savePersonal}
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

export default PersonalPanel;