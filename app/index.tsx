import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { getRooms, deleteRoom } from '../src/utils/storage';
import { Room } from '../src/types';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../src/context/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadRooms();
            }
        }, [user])
    );

    const loadRooms = async () => {
        if (!user) return;
        setLoading(true);
        const loadedRooms = await getRooms(user.uid);
        setRooms(loadedRooms);
        setLoading(false);
    };

    const handleDeleteRoom = (roomId: string) => {
        Alert.alert(
            "Raum löschen",
            "Möchtest du diesen Raum wirklich löschen? Alle Kisten darin werden auch gelöscht.",
            [
                { text: "Abbrechen", style: "cancel" },
                {
                    text: "Löschen",
                    style: "destructive",
                    onPress: async () => {
                        await deleteRoom(roomId);
                        loadRooms();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Room }) => (
        <Link href={`/room/${item.id}`} asChild>
            <TouchableOpacity style={styles.card} onLongPress={() => handleDeleteRoom(item.id)}>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>Erstellt am {new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.cardIcon}>
                    <Text style={styles.iconText}>📦</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f4511e" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <FlatList
                data={rooms}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <Text style={styles.headerTitle}>Deine Lagerorte</Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🏠</Text>
                        <Text style={styles.emptyText}>Noch keine Räume.</Text>
                        <Text style={styles.emptySubText}>
                            Erstelle deinen ersten Raum, um Ordnung zu schaffen.
                        </Text>
                    </View>
                }
            />

            <View style={styles.fabContainer}>
                <Link href="/scan" asChild>
                    <TouchableOpacity style={[styles.fab, styles.scanFab]}>
                        <Text style={styles.fabText}>📷</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/add-room" asChild>
                    <TouchableOpacity style={[styles.fab, styles.addFab]}>
                        <Text style={styles.fabText}>+</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 20,
        marginLeft: 4,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#888',
    },
    cardIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#fff0e6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    iconText: {
        fontSize: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyIcon: {
        fontSize: 60,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    emptySubText: {
        marginTop: 8,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
        lineHeight: 20,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#f4511e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    addFab: {
        backgroundColor: '#f4511e',
    },
    scanFab: {
        backgroundColor: '#2196F3',
        shadowColor: '#2196F3',
    },
    fabText: {
        fontSize: 28,
        color: 'white',
        fontWeight: '300',
    },
});
