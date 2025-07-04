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
        categoria: '',
        capacidad: '',
        estado: 'activo'
    });

    // Simulación de datos iniciales
    useEffect(() => {
        loadEventos();
    }, []);

    const loadEventos = () => {
        setLoading(true);
        // Aquí conectarías con tu API
        setTimeout(() => {
            const mockData = [
                {
                    _id: '6832c259f8f90e35e6c5ace1',
                    id: '1',
                    titulo: 'Conferencia de Tecnología 2025',
                    descripcion: 'Conferencia sobre las últimas tendencias en tecnología y desarrollo de software.',
                    fecha: '2025-07-15',
                    hora: '09:00',
                    ubicacion: 'Auditorio Principal',
                    organizador: 'Departamento de Sistemas',
                    categoria: 'Académico',
                    capacidad: '200',
                    estado: 'activo'
                },
                {
                    _id: '6832c259f8f90e35e6c5ace2',
                    id: '2',
                    titulo: 'Torneo de Fútbol Universitario',
                    descripcion: 'Competencia deportiva entre las diferentes facultades de la universidad.',
                    fecha: '2025-08-20',
                    hora: '14:00',
                    ubicacion: 'Campo Deportivo Norte',
                    organizador: 'Departamento de Deportes',
                    categoria: 'Deportivo',
                    capacidad: '500',
                    estado: 'activo'
                },
                {
                    _id: '6832c259f8f90e35e6c5ace3',
                    id: '3',
                    titulo: 'Ceremonia de Graduación',
                    descripcion: 'Ceremonia de graduación para estudiantes de la promoción 2025.',
                    fecha: '2025-12-10',
                    hora: '10:00',
                    ubicacion: 'Teatro Universitario',
                    organizador: 'Rectoría',
                    categoria: 'Ceremonial',
                    capacidad: '1000',
                    estado: 'programado'
                }
            ];
            setEventos(mockData);
            setLoading(false);
        }, 1000);
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
            categoria: '',
            capacidad: '',
            estado: 'activo'
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
        if (!currentEvento.id.trim()) {
            Alert.alert('Error', 'El ID es requerido');
            return false;
        }
        if (!currentEvento.titulo.trim()) {
            Alert.alert('Error', 'El título es requerido');
            return false;
        }
        if (!currentEvento.descripcion.trim()) {
            Alert.alert('Error', 'La descripción es requerida');
            return false;
        }
        if (!currentEvento.fecha.trim()) {
            Alert.alert('Error', 'La fecha es requerida');
            return false;
        }
        if (!currentEvento.hora.trim()) {
            Alert.alert('Error', 'La hora es requerida');
            return false;
        }
        if (!currentEvento.ubicacion.trim()) {
            Alert.alert('Error', 'La ubicación es requerida');
            return false;
        }
        if (!currentEvento.organizador.trim()) {
            Alert.alert('Error', 'El organizador es requerido');
            return false;
        }
        if (!currentEvento.categoria.trim()) {
            Alert.alert('Error', 'La categoría es requerida');
            return false;
        }
        return true;
    };

    const saveEvento = () => {
        if (!validateForm()) return;

        setLoading(true);
        
        // Aquí harías la llamada a tu API
        setTimeout(() => {
            if (editMode) {
                // Actualizar evento existente
                setEventos(prev => 
                    prev.map(event => 
                        event._id === currentEvento._id ? currentEvento : event
                    )
                );
                Alert.alert('Éxito', 'Evento actualizado correctamente');
            } else {
                // Crear nuevo evento
                const newEvento = {
                    ...currentEvento,
                    _id: Date.now().toString(), // ID temporal
                };
                setEventos(prev => [...prev, newEvento]);
                Alert.alert('Éxito', 'Evento creado correctamente');
            }
            setLoading(false);
            closeModal();
        }, 1000);
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
                    onPress: () => {
                        setLoading(true);
                        // Aquí harías la llamada a tu API
                        setTimeout(() => {
                            setEventos(prev => 
                                prev.filter(event => event._id !== evento._id)
                            );
                            setLoading(false);
                            Alert.alert('Éxito', 'Evento eliminado correctamente');
                        }, 1000);
                    }
                }
            ]
        );
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'activo': return '#4CAF50';
            case 'programado': return '#FF9800';
            case 'finalizado': return '#9E9E9E';
            case 'cancelado': return '#F44336';
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
        const date = new Date(fecha);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

                            <View style={styles.formRow}>
                                <View style={styles.formHalf}>
                                    <Text style={styles.label}>Categoría *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={currentEvento.categoria}
                                        onChangeText={(text) => 
                                            setCurrentEvento(prev => ({ ...prev, categoria: text }))
                                        }
                                        placeholder="Académico/Deportivo/Cultural"
                                    />
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
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Estado</Text>
                                <TextInput
                                    style={styles.input}
                                    value={currentEvento.estado}
                                    onChangeText={(text) => 
                                        setCurrentEvento(prev => ({ ...prev, estado: text }))
                                    }
                                    placeholder="activo/programado/finalizado/cancelado"
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