import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/PrincipalPanel';

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

const PrincipalPanel = ({ nombre = "Usuario" }) => {

    const navigation = useNavigation();
    const [count, setCount] = useState(0);
    const [count2, setCount2] = useState(0);
    const [count3, setCount3] = useState(0);
    const [count4, setCount4] = useState(0);

    const fetchStudents = async () => {
        try {
            const response = await fetch('https://server-zeta-ten-25.vercel.app/api/usersAll');
            const data = await response.json();
            setCount(data.length);
            console.log(data.length);
            console.log(data);
        } catch (error) {
            console.error('Error al obtener los estudiantes:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://192.168.100.96:3000/api/destinos');
            const data = await response.json();
            setCount2(data.count);
            console.log(data.count);
            console.log(data);
        } catch (error) {
            console.error('Error al obtener los departamentos:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://192.168.100.96:3000/api/events');
            const data = await response.json();
            setCount3(data.count);
            console.log(data.count);
            console.log(data);
        } catch (error) {
            console.error('Error al obtener los eventos:', error);
        }
    };

    const fetchPersonal = async () => {
        try {
            const response = await fetch('http://192.168.100.96:3000/api/personal');
            const data = await response.json();
            setCount4(data.count);
            console.log(data.count);
            console.log(data);
        } catch (error) {
            console.error('Error al obtener los personal:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
        fetchEvents();
        fetchPersonal();
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar backgroundColor="#1565C0" barStyle="light-content" />

            {/* Header Section */}
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
                            <Text style={styles.profileName}>{nombre}</Text>
                            <Text style={styles.profileRole}>Administrador</Text>
                        </View>
                        <View style={styles.profileIcon}>
                            <Text style={styles.profileText}>👤</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Spacing after header */}
            <View style={{ height: 25 }} />

            {/* Statistics Section */}
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1565C0',
                    marginBottom: 15,
                    textAlign: 'center'
                }}>Estadísticas Generales</Text>

                <View style={styles.statsSection}>
                    <View style={styles.statsCard}>
                        <View style={styles.statsIconContainer}>
                            <Text style={styles.statsIcon}>👥</Text>
                        </View>
                        <View style={styles.statsContent}>
                            <Text style={styles.statsNumber}>{count}</Text>
                            <Text style={styles.statsLabel}>Estudiantes</Text>
                            <Text style={styles.statsSubLabel}>Activos</Text>
                        </View>
                    </View>

                    <View style={styles.statsCard}>
                        <View style={styles.statsIconContainer}>
                            <Text style={styles.statsIcon}>🎓</Text>
                        </View>
                        <View style={styles.statsContent}>
                            <Text style={styles.statsNumber}>{count4}</Text>
                            <Text style={styles.statsLabel}>Docentes</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 18 }} />

                <View style={styles.statsSection}>
                    <View style={[styles.statsCard, styles.fullWidthCard]}>
                        <View style={styles.statsIconContainer}>
                            <Text style={styles.statsIcon}>📚</Text>
                        </View>
                        <View style={styles.statsContent}>
                            <Text style={styles.statsNumber}>{count2}</Text>
                            <Text style={styles.statsLabel}>Destinos</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ height: 35 }} />

            <View style={styles.actionsSection}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1565C0',
                    marginBottom: 20,
                    textAlign: 'center'
                }}>Módulos del Sistema</Text>

                <View style={styles.buttonGrid}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.navigate('DeparamentPanel'); }}>
                        <View style={styles.buttonHeader}>
                            <Text style={styles.buttonIcon}>🏢</Text>
                            <View style={styles.buttonBadge}>
                                <Text style={styles.badgeText}>15</Text>
                            </View>
                        </View>
                        <Text style={styles.buttonTitle}>Departamentos</Text>
                        <Text style={styles.buttonDescription}>Gestión de facultades y departamentos académicos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.navigate('PersonalPanel'); }}>
                        <View style={styles.buttonHeader}>
                            <Text style={styles.buttonIcon}>👨‍🏫</Text>
                            <View style={styles.buttonBadge}>
                                <Text style={styles.badgeText}>{count4}</Text>
                            </View>
                        </View>
                        <Text style={styles.buttonTitle}>Personal Académico</Text>
                        <Text style={styles.buttonDescription}>Administración de docentes y personal</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 25 }} />

                <View style={styles.buttonGrid}>
                    <TouchableOpacity style={[styles.actionButton, styles.fullWidthButton]} onPress={() => { navigation.navigate('EventPanel'); }}>
                        <View style={styles.buttonHeader}>
                            <Text style={styles.buttonIcon}>📋</Text>
                            <View style={styles.buttonBadge}>
                                <Text style={styles.badgeText}>{count3}</Text>
                            </View>
                        </View>
                        <Text style={styles.buttonTitle}>Eventos Institucionales</Text>
                        <Text style={styles.buttonDescription}>Gestión de actividades universitarias</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 25 }} />

                <View style={styles.buttonGrid}>
                    <TouchableOpacity style={[styles.actionButton, styles.fullWidthButton]} onPress={() => { navigation.navigate('ReportPanel'); }}>
                        <View style={styles.buttonHeader}>
                            <Text style={styles.buttonIcon}>📈</Text>
                        </View>
                        <Text style={styles.buttonTitle}>Reportes y Análisis</Text>
                        <Text style={styles.buttonDescription}>Estadísticas y métricas institucionales</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

export default PrincipalPanel;