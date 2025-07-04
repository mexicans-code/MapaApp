import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import styles from './styles/ReportPanel'; // Archivo de estilos que crearás

const { width } = Dimensions.get('window');

const ReportPanel = () => {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState({
        totalRutas: 0,
        rutasActivas: 0,
        rutasInactivas: 0,
        departamentos: [],
        eventosActivos: [],
        rutasPorMes: [],
        estadisticasGenerales: {}
    });
    const [selectedReport, setSelectedReport] = useState('general');

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = () => {
        setLoading(true);
        // Simulación de datos de reportes
        setTimeout(() => {
            const mockReportData = {
                totalRutas: 28,
                rutasActivas: 24,
                rutasInactivas: 4,
                departamentos: [
                    { nombre: 'Ingeniería', cantidad: 8, porcentaje: 28.6 },
                    { nombre: 'Matemáticas', cantidad: 6, porcentaje: 21.4 },
                    { nombre: 'Psicología', cantidad: 5, porcentaje: 17.9 },
                    { nombre: 'Administración', cantidad: 4, porcentaje: 14.3 },
                    { nombre: 'Medicina', cantidad: 3, porcentaje: 10.7 },
                    { nombre: 'Otros', cantidad: 2, porcentaje: 7.1 }
                ],
                eventosActivos: [
                    { nombre: 'Semana de la Ciencia', fecha: '2024-07-15', participantes: 150, departamento: 'Ingeniería' },
                    { nombre: 'Conferencia de IA', fecha: '2024-07-20', participantes: 85, departamento: 'Matemáticas' },
                    { nombre: 'Taller de Liderazgo', fecha: '2024-07-25', participantes: 60, departamento: 'Psicología' },
                    { nombre: 'Feria de Empleo', fecha: '2024-08-01', participantes: 200, departamento: 'Administración' }
                ],
                rutasPorMes: [
                    { mes: 'Enero', cantidad: 2 },
                    { mes: 'Febrero', cantidad: 1 },
                    { mes: 'Marzo', cantidad: 3 },
                    { mes: 'Abril', cantidad: 4 },
                    { mes: 'Mayo', cantidad: 1 },
                    { mes: 'Junio', cantidad: 3 }
                ],
                estadisticasGenerales: {
                    promedioEstudiantes: '45 estudiantes',
                    rutaMasPopular: 'Ingeniería Civil',
                    eventosProximos: 12
                }
            };
            setReportData(mockReportData);
            setLoading(false);
        }, 1000);
    };

    const generatePDFReport = () => {
        Alert.alert(
            'Generar Reporte PDF',
            '¿Deseas generar un reporte de rutas y eventos en PDF?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Generar',
                    onPress: () => {
                        Alert.alert('Éxito', 'Reporte PDF de rutas generado correctamente');
                    }
                }
            ]
        );
    };

    const exportExcel = () => {
        Alert.alert(
            'Exportar a Excel',
            '¿Deseas exportar los datos de rutas a un archivo Excel?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Exportar',
                    onPress: () => {
                        Alert.alert('Éxito', 'Datos de rutas exportados a Excel correctamente');
                    }
                }
            ]
        );
    };

    const renderMetricCard = (title, value, icon, color = '#1565C0') => (
        <View style={[styles.metricCard, { borderLeftColor: color }]}>
            <View style={styles.metricHeader}>
                <Text style={styles.metricIcon}>{icon}</Text>
                <Text style={styles.metricTitle}>{title}</Text>
            </View>
            <Text style={[styles.metricValue, { color }]}>{value}</Text>
        </View>
    );

    const renderBarChart = (data, title) => (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{title}</Text>
            {data.map((item, index) => (
                <View key={index} style={styles.barItem}>
                    <View style={styles.barLabel}>
                        <Text style={styles.barLabelText}>{item.nombre}</Text>
                        <Text style={styles.barValue}>{item.cantidad}</Text>
                    </View>
                    <View style={styles.barContainer}>
                        <View 
                            style={[
                                styles.bar, 
                                { 
                                    width: `${item.porcentaje}%`,
                                    backgroundColor: `hsl(${210 + (index * 30)}, 70%, 50%)`
                                }
                            ]} 
                        />
                    </View>
                    <Text style={styles.barPercentage}>{item.porcentaje.toFixed(1)}%</Text>
                </View>
            ))}
        </View>
    );

    const renderGeneralReport = () => (
        <ScrollView style={styles.reportContent}>
            {/* Métricas principales */}
            <View style={styles.metricsGrid}>
                {renderMetricCard('Total Rutas', reportData.totalRutas, '🚌', '#1565C0')}
                {renderMetricCard('Rutas Activas', reportData.rutasActivas, '✅', '#4CAF50')}
                {renderMetricCard('Rutas Inactivas', reportData.rutasInactivas, '⏸️', '#FF9800')}
                {renderMetricCard('Eventos Próximos', reportData.estadisticasGenerales.eventosProximos, '📅', '#9C27B0')}
            </View>

            {/* Estadísticas adicionales */}
            <View style={styles.additionalStats}>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>🚌 Ruta más popular:</Text>
                    <Text style={styles.statValue}>{reportData.estadisticasGenerales.rutaMasPopular}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>👥 Promedio estudiantes/ruta:</Text>
                    <Text style={styles.statValue}>{reportData.estadisticasGenerales.promedioEstudiantes}</Text>
                </View>
            </View>

            {/* Gráficos */}
            {renderBarChart(reportData.departamentos, '📊 Rutas por Departamento')}

            {/* Eventos activos */}
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>🎉 Eventos Activos</Text>
                {reportData.eventosActivos.map((evento, index) => (
                    <View key={index} style={styles.eventCard}>
                        <View style={styles.eventHeader}>
                            <Text style={styles.eventName}>{evento.nombre}</Text>
                            <View style={styles.eventBadge}>
                                <Text style={styles.eventDate}>📅 {evento.fecha}</Text>
                            </View>
                        </View>
                        <View style={styles.eventInfo}>
                            <Text style={styles.eventDepartment}>🏢 {evento.departamento}</Text>
                            <Text style={styles.eventParticipants}>👥 {evento.participantes} participantes</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    const renderMonthlyReport = () => (
        <ScrollView style={styles.reportContent}>
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>📈 Nuevas Rutas por Mes (2024)</Text>
                {reportData.rutasPorMes.map((item, index) => (
                    <View key={index} style={styles.monthItem}>
                        <Text style={styles.monthLabel}>{item.mes}</Text>
                        <View style={styles.monthBarContainer}>
                            <View 
                                style={[
                                    styles.monthBar, 
                                    { 
                                        width: item.cantidad > 0 ? `${(item.cantidad / 4) * 100}%` : '2%',
                                        backgroundColor: item.cantidad > 2 ? '#4CAF50' : item.cantidad > 0 ? '#FF9800' : '#E0E0E0'
                                    }
                                ]} 
                            />
                        </View>
                        <Text style={styles.monthValue}>{item.cantidad}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#1565C0" barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.headerTitle}>Sistema Universitario</Text>
                            <Text style={styles.headerSubtitle}>Dashboard de Rutas y Eventos</Text>
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

            {/* Tabs de reportes */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedReport === 'general' && styles.activeTab]}
                    onPress={() => setSelectedReport('general')}
                >
                    <Text style={[styles.tabText, selectedReport === 'general' && styles.activeTabText]}>
                        🚌 Rutas
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedReport === 'monthly' && styles.activeTab]}
                    onPress={() => setSelectedReport('monthly')}
                >
                    <Text style={[styles.tabText, selectedReport === 'monthly' && styles.activeTabText]}>
                        📈 Mensual
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={generatePDFReport}>
                    <Text style={styles.actionButtonText}>📄 PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={exportExcel}>
                    <Text style={styles.actionButtonText}>📊 Excel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={loadReportData}>
                    <Text style={styles.actionButtonText}>🔄 Actualizar</Text>
                </TouchableOpacity>
            </View>

            {/* Contenido del reporte */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1565C0" />
                    <Text style={styles.loadingText}>Cargando rutas y eventos...</Text>
                </View>
            ) : (
                selectedReport === 'general' ? renderGeneralReport() : renderMonthlyReport()
            )}
        </View>
    );
};

export default ReportPanel;