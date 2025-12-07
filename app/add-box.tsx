import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { saveBox } from '../src/utils/storage';
import { useAuth } from '../src/context/AuthContext';

export default function AddBox() {
    const [name, setName] = useState('');
    const [contents, setContents] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { roomId } = useLocalSearchParams<{ roomId: string }>();
    const { user } = useAuth();

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Fehler', 'Bitte gib der Kiste einen Namen.');
            return;
        }

        if (!roomId) {
            Alert.alert('Fehler', 'Kein Raum ausgewählt.');
            return;
        }

        if (!user) {
            Alert.alert('Fehler', 'Nicht angemeldet.');
            return;
        }

        setLoading(true);
        const newBox = {
            name: name.trim(),
            contents: contents.trim(),
        };

        const boxId = await saveBox(newBox, roomId, user.uid);
        setLoading(false);

        if (boxId) {
            // Navigate to the box detail or back to room
            // Going to box detail allows seeing the QR code immediately
            router.replace(`/box/${boxId}`);
        } else {
            Alert.alert('Fehler', 'Kiste konnte nicht gespeichert werden.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Kisten Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="z.B. Sommerkleidung"
                    autoFocus
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Inhalt</Text>
                <Text style={styles.hint}>
                    Tippe auf das Mikrofon-Symbol auf deiner Tastatur für Spracheingabe.
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

            <TouchableOpacity
                style={[styles.saveButton, loading && styles.disabledButton]}
                onPress={handleSave}
                disabled={loading}
            >
                <Text style={styles.saveButtonText}>
                    {loading ? 'Speichern...' : 'Speichern & QR Code erstellen'}
                </Text>
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
    disabledButton: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
