import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles/PrincipalPanel';

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

const PrincipalPanel = ({ nombre = "Usuario" }) => {

    const navigation = useNavigation();
    const [count, setCount] = useState(0);
    const [count2, setCount2] = useState(0);

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
            const response = await fetch('https://server-zeta-ten-25.vercel.app/api/destinos');
            const data = await response.json();
            setCount2(data.count);
            console.log(data.count);
            console.log(data);
        } catch (error) {
            console.error('Error al obtener los departamentos:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
    }, []);
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
                            <Text style={styles.profileName}>{nombre}</Text>
                            <Text style={styles.profileRole}>Administrador</Text>
                        </View>
                        <View style={styles.profileIcon}>
                            <Text style={styles.profileText}>👤</Text>
                        </View>
                    </View>
                </View>
            </View>

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
                        <Text style={styles.statsNumber}>147</Text>
                        <Text style={styles.statsLabel}>Docentes</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsSection}>
                <View style={[styles.statsCard, styles.fullWidthCard]}>
                    <View style={styles.statsIconContainer}>
                        <Text style={styles.statsIcon}>📚</Text>
                    </View>
                    <View style={styles.statsContent}>
                        <Text style={styles.statsNumber}>{count2}</Text>
                        <Text style={styles.statsLabel}>Departamentos</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsSection}>
                <Text style={styles.sectionTitle}>Módulos del Sistema</Text>

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
                                <Text style={styles.badgeText}>147</Text>
                            </View>
                        </View>
                        <Text style={styles.buttonTitle}>Personal Académico</Text>
                        <Text style={styles.buttonDescription}>Administración de docentes y personal</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonGrid}>
                    <TouchableOpacity style={[styles.actionButton, styles.fullWidthButton]} onPress={() => { navigation.navigate('EventPanel'); }}>
                        <View style={styles.buttonHeader}>
                            <Text style={styles.buttonIcon}>📋</Text>
                            <View style={styles.buttonBadge}>
                                <Text style={styles.badgeText}>23</Text>
                            </View>
                        </View>
                        <Text style={styles.buttonTitle}>Eventos Institucionales</Text>
                        <Text style={styles.buttonDescription}>Gestión de actividades universitarias</Text>
                    </TouchableOpacity>
                </View>

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

            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
};

export default PrincipalPanel;