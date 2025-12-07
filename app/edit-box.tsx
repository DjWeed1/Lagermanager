import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getBoxById, updateBox } from '../src/types/../utils/storage';
import { Box } from '../src/types';

export default function EditBox() {
    const { id } = useLocalSearchParams();
    const [name, setName] = useState('');
    const [contents, setContents] = useState('');
    const [loading, setLoading] = useState(true);
    const [originalBox, setOriginalBox] = useState<Box | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        loadBox();
    }, [id]);

    const loadBox = async () => {
        if (typeof id === 'string') {
            const box = await getBoxById(id);
            if (box) {
                setOriginalBox(box);
                setName(box.name);
                setContents(box.contents);
            } else {
                Alert.alert('Fehler', 'Kiste nicht gefunden.');
                router.back();
            }
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Fehler', 'Bitte gib der Kiste einen Namen.');
            return;
        }

        if (!originalBox) return;

        const updatedBox: Box = {
            ...originalBox,
            name: name.trim(),
            contents: contents.trim(),
        };

        await updateBox(updatedBox.id, updatedBox);
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#f4511e" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Kisten Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="z.B. Sommerkleidung"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Inhalt</Text>
                <Text style={styles.hint}>
                    Du kannst den Inhalt hier bearbeiten oder ergänzen.
                </Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={contents}
                    onChangeText={setContents}
                    placeholder="Was ist in der Kiste?"
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Änderungen speichern</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    hint: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 150,
    },
    saveButton: {
        backgroundColor: '#f4511e',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
