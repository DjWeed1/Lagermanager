import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Link, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { getBoxes, deleteBox } from '../../src/utils/storage';
import { Box } from '../../src/types';
import { StatusBar } from 'expo-status-bar';

export default function RoomDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBoxes, setFilteredBoxes] = useState<Box[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            if (id) {
                loadBoxes();
            }
        }, [id])
    );

    const loadBoxes = async () => {
        if (!id) return;
        setLoading(true);
        const loadedBoxes = await getBoxes(id);
        const sortedBoxes = loadedBoxes.sort((a: Box, b: Box) => b.createdAt - a.createdAt);
        setBoxes(sortedBoxes);
        if (searchQuery) {
            handleSearch(searchQuery, sortedBoxes);
        } else {
            setFilteredBoxes(sortedBoxes);
        }
        setLoading(false);
    };

    const handleSearch = (text: string, currentBoxes = boxes) => {
        setSearchQuery(text);
        if (text) {
            const lowerText = text.toLowerCase();
            const filtered = currentBoxes.filter(
                (box) =>
                    box.name.toLowerCase().includes(lowerText) ||
                    box.contents.toLowerCase().includes(lowerText)
            );
            setFilteredBoxes(filtered);
        } else {
            setFilteredBoxes(currentBoxes);
        }
    };

    const handleDeleteBox = (boxId: string) => {
        Alert.alert(
            "Kiste löschen",
            "Möchtest du diese Kiste wirklich löschen?",
            [
                { text: "Abbrechen", style: "cancel" },
                {
                    text: "Löschen",
                    style: "destructive",
                    onPress: async () => {
                        await deleteBox(boxId);
                        loadBoxes();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Box }) => (
        <Link href={`/box/${item.id}`} asChild>
            <TouchableOpacity style={styles.card} onLongPress={() => handleDeleteBox(item.id)}>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={2}>
                        {item.contents}
                    </Text>
                </View>
                <View style={styles.cardIcon}>
                    <Text style={styles.iconText}>➡️</Text>
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

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Suche nach Kiste oder Inhalt..."
                    value={searchQuery}
                    onChangeText={(text) => handleSearch(text)}
                    clearButtonMode="while-editing"
                    placeholderTextColor="#999"
                />
            </View>

            <FlatList
                data={filteredBoxes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyText}>Keine Kisten in diesem Raum.</Text>
                        <Text style={styles.emptySubText}>
                            {searchQuery ? 'Versuche einen anderen Suchbegriff.' : 'Füge eine neue Kiste hinzu.'}
                        </Text>
                    </View>
                }
            />

            <View style={styles.fabContainer}>
                <Link href={{ pathname: "/add-box", params: { roomId: id } }} asChild>
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
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: {
        backgroundColor: '#f0f2f5',
        padding: 12,
        borderRadius: 12,
        fontSize: 16,
        color: '#333',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    cardIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
        color: '#ccc',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    emptySubText: {
        marginTop: 8,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
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
    fabText: {
        fontSize: 28,
        color: 'white',
        fontWeight: '300',
    },
});
