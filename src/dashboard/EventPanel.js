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
import styles from './styles/EventoPanel';

const EventPanel = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEvento, setCurrentEvento] = useState({
        _id: '',
        id: '',
        titulo: '',
        descripcion: '',
        fecha: '',
        hora: '',
        ubicacion: '',
        organizador: '',
        estado: 'activo',
        imagen: ''
    });

    // URL base de tu API
    const API_BASE_URL = 'http://192.168.100.96:3000/api/events';
    
    useEffect(() => {
        loadEventos();
    }, []);

    const loadEventos = () => {
        setLoading(true);
        fetchEventos();
    };

    const fetchEventos = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setEventos(data.data || data);
        } catch (error) {
            console.error('Error fetching eventos:', error);
            Alert.alert('Error', 'No se pudo cargar los eventos. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCurrentEvento({
            _id: '',
            id: '',
            titulo: '',
            descripcion: '',
            fecha: '',
            hora: '',
            ubicacion: '',
            organizador: '',
            estado: 'activo',
            imagen: ''
        });
        setEditMode(false);
    };

    const openModal = (evento = null) => {
        if (evento) {
            setCurrentEvento(evento);
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
        const requiredFields = [
            { field: 'id', name: 'ID' },
            { field: 'titulo', name: 'título' },
            { field: 'descripcion', name: 'descripción' },
            { field: 'fecha', name: 'fecha' },
            { field: 'hora', name: 'hora' },
            { field: 'ubicacion', name: 'ubicación' },
            { field: 'organizador', name: 'organizador' },
            { field: 'imagen', name: 'imagen' }
        ];

        for (const { field, name } of requiredFields) {
            if (!currentEvento[field]?.trim()) {
                Alert.alert('Error', `${name.charAt(0).toUpperCase() + name.slice(1)} es requerido`);
                return false;
            }
        }

        // Validación básica de fecha (formato YYYY-MM-DD)
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!fechaRegex.test(currentEvento.fecha)) {
            Alert.alert('Error', 'La fecha debe tener el formato YYYY-MM-DD');
            return false;
        }

        // Validación básica de hora (formato HH:MM)
        const horaRegex = /^\d{2}:\d{2}$/;
        if (!horaRegex.test(currentEvento.hora)) {
            Alert.alert('Error', 'La hora debe tener el formato HH:MM');
            return false;
        }

        return true;
    };

    const saveEvento = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            // Preparar los datos para enviar
            const eventoData = {
                id: currentEvento.id,
                titulo: currentEvento.titulo,
                descripcion: currentEvento.descripcion,
                fecha: currentEvento.fecha,
                hora: currentEvento.hora,
                ubicacion: currentEvento.ubicacion,
                organizador: currentEvento.organizador,
                estado: currentEvento.estado,
                imagen: currentEvento.imagen
            };

            let response;

            if (editMode) {
                // Actualizar evento existente
                response = await fetch(`${API_BASE_URL}/${currentEvento._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventoData)
                });
            } else {
                // Crear nuevo evento
                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventoData)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (editMode) {
                // Actualizar el evento en el estado local
                setEventos(prev =>
                    prev.map(event =>
                        event._id === currentEvento._id ? result.data || result : event
                    )
                );
                Alert.alert('Éxito', 'Evento actualizado correctamente');
            } else {
                // Agregar el nuevo evento al estado local
                setEventos(prev => [...prev, result.data || result]);
                Alert.alert('Éxito', 'Evento creado correctamente');
            }

            closeModal();
        } catch (error) {
            console.error('Error saving evento:', error);
            Alert.alert('Error', error.message || 'No se pudo guardar el evento. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const deleteEvento = (evento) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de eliminar "${evento.titulo}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => performDelete(evento)
                }
            ]
        );
    };

    const performDelete = async (evento) => {
        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/${evento._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Remover el evento del estado local
            setEventos(prev => prev.filter(event => event._id !== evento._id));
            Alert.alert('Éxito', 'Evento eliminado correctamente');
        } catch (error) {
            console.error('Error deleting evento:', error);
            Alert.alert('Error', error.message || 'No se pudo eliminar el evento. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'activo': return '#4CAF50';
            case 'inactivo': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const getCategoryIcon = (categoria) => {
        switch (categoria) {
            case 'Académico': return '🎓';
            case 'Deportivo': return '⚽';
            case 'Cultural': return '🎭';
            case 'Ceremonial': return '🎉';
            case 'Social': return '👥';
            default: return '📅';
        }
    };

    const formatDate = (fecha) => {
        try {
            const date = new Date(fecha);
            return date.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return fecha;
        }
    };

    const renderEvento = ({ item }) => (
        <View style={styles.eventoCard}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View style={styles.idBadge}>
                        <Text style={styles.idText}>#{item.id}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
                        <Text style={styles.statusText}>{item.estado}</Text>
                    </View>
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
                        onPress={() => deleteEvento(item)}
                    >
                        <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.titleSection}>
                <Text style={styles.categoryIcon}>{getCategoryIcon(item.categoria)}</Text>
                <Text style={styles.eventoTitle}>{item.titulo}</Text>
            </View>

            <Text style={styles.eventoDescription}>{item.descripcion}</Text>

            <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📅</Text>
                    <Text style={styles.detailText}>{formatDate(item.fecha)} a las {item.hora}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{item.ubicacion}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>👨‍💼</Text>
                    <Text style={styles.detailText}>{item.organizador}</Text>
                </View>
                {item.capacidad && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailIcon}>👥</Text>
                        <Text style={styles.detailText}>Capacidad: {item.capacidad} personas</Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#1565C0" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gestión de Eventos</Text>
                <Text style={styles.headerSubtitle}>
                    {eventos.length} evento{eventos.length !== 1 ? 's' : ''} registrado{eventos.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {/* Add Button */}
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => openModal()}
                    disabled={loading}
                >
                    <Text style={styles.addButtonText}>+ Nuevo Evento</Text>
                </TouchableOpacity>
            </View>

            {/* Events List */}
            {loading && !modalVisible ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1565C0" />
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            ) : (
                <FlatList
                    data={eventos}
                    renderItem={renderEvento}
                    keyExtractor={(item) => item._id}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={loadEventos}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay eventos registrados</Text>
                            <Text style={styles.emptySubtext}>Agrega el primer evento</Text>
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
                                {editMode ? 'Editar Evento' : 'Nuevo Evento'}
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>ID del Evento *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentEvento.id}
                                    onChangeText={(text) =>
                                        setCurrentEvento(prev => ({ ...prev, id: text }))
                                    }
                                    placeholder="Ej: 4"
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Título del Evento *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentEvento.titulo}
                                    onChangeText={(text) =>
                                        setCurrentEvento(prev => ({ ...prev, titulo: text }))
                                    }
                                    placeholder="Ej: Conferencia de Innovación"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Descripción *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={currentEvento.descripcion}
                                    onChangeText={(text) =>
                                        setCurrentEvento(prev => ({ ...prev, descripcion: text }))
                                    }
                                    placeholder="Describe el evento..."
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.formRow}>
                                <View style={styles.formHalf}>
                                    <Text style={styles.label}>Fecha *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={currentEvento.fecha}
                                        onChangeText={(text) =>
                                            setCurrentEvento(prev => ({ ...prev, fecha: text }))
                                        }
                                        placeholder="YYYY-MM-DD"
                                    />
                                </View>
                                <View style={styles.formHalf}>
                                    <Text style={styles.label}>Hora *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={currentEvento.hora}
                                        onChangeText={(text) =>
                                            setCurrentEvento(prev => ({ ...prev, hora: text }))
                                        }
                                        placeholder="HH:MM"
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Ubicación *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentEvento.ubicacion}
                                    onChangeText={(text) =>
                                        setCurrentEvento(prev => ({ ...prev, ubicacion: text }))
                                    }
                                    placeholder="Ej: Auditorio Principal"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Organizador *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentEvento.organizador}
                                    onChangeText={(text) =>
                                        setCurrentEvento(prev => ({ ...prev, organizador: text }))
                                    }
                                    placeholder="Ej: Departamento de Sistemas"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Imagen *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentEvento.imagen}
                                    onChangeText={(text) =>
                                        setCurrentEvento(prev => ({ ...prev, imagen: text }))
                                    }
                                    placeholder="Ej: https://example.com/image.jpg"
                                />
                            </View>
{/* 
                            <View style={styles.formRow}>
                                <View style={styles.formHalf}>
                                    <Text style={styles.label}>Categoría *</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={currentEvento.categoria}
                                            style={styles.picker}
                                            onValueChange={(itemValue) =>
                                                setCurrentEvento(prev => ({ ...prev, categoria: itemValue }))
                                            }
                                        >
                                            <Picker.Item label="Selecciona categoría" value="" />
                                            <Picker.Item label="Académico" value="Académico" />
                                            <Picker.Item label="Deportivo" value="Deportivo" />
                                            <Picker.Item label="Cultural" value="Cultural" />
                                            <Picker.Item label="Ceremonial" value="Ceremonial" />
                                            <Picker.Item label="Social" value="Social" />
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.formHalf}>
                                    <Text style={styles.label}>Capacidad</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={currentEvento.capacidad}
                                        onChangeText={(text) =>
                                            setCurrentEvento(prev => ({ ...prev, capacidad: text }))
                                        }
                                        placeholder="Ej: 200"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View> */}
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Estatus</Text>
                                    <View style={styles.radioGroup}>
                                        <TouchableOpacity
                                            style={[styles.radioOption, currentEvento.estado === 'activo' && styles.radioSelected]}
                                            onPress={() => setCurrentEvento(prev => ({ ...prev, estado: 'activo' }))}
                                        >
                                            <Text style={styles.radioText}>🟢 Activo</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.radioOption, currentEvento.estado === 'inactivo' && styles.radioSelected]}
                                            onPress={() => setCurrentEvento(prev => ({ ...prev, estado: 'inactivo' }))}
                                        >
                                            <Text style={styles.radioText}>🔴 Inactivo</Text>
                                        </TouchableOpacity>
                                    </View>
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
                                    onPress={saveEvento}
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

export default EventPanel;