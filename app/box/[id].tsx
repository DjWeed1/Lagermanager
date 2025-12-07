import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Box } from '../../src/types';
import { getBoxById, deleteBox } from '../../src/utils/storage';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as Speech from 'expo-speech';

export default function BoxDetail() {
    const { id } = useLocalSearchParams();
    const [box, setBox] = useState<Box | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const svgRef = useRef<any>(null);

    useEffect(() => {
        loadBox();
    }, [id]);

    const loadBox = async () => {
        if (typeof id === 'string') {
            const foundBox = await getBoxById(id);
            setBox(foundBox);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        Alert.alert(
            'Löschen',
            'Möchtest du diese Kiste wirklich löschen?',
            [
                { text: 'Abbrechen', style: 'cancel' },
                {
                    text: 'Löschen',
                    style: 'destructive',
                    onPress: async () => {
                        if (typeof id === 'string') {
                            await deleteBox(id);
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    const handlePrint = async () => {
        if (!box) return;

        const qrValue = `lagermanager://box/${box.id}`;

        svgRef.current.toDataURL(async (dataURL: string) => {
            const html = `
        <html>
          <head>
            <style>
              body { font-family: Helvetica, Arial, sans-serif; text-align: center; padding: 20px; }
              h1 { font-size: 40px; margin-bottom: 10px; }
              p { font-size: 24px; color: #666; }
              .qr { margin: 20px auto; width: 300px; height: 300px; }
              img { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <h1>${box.name}</h1>
            <div class="qr">
              <img src="data:image/png;base64,${dataURL}" />
            </div>
            <p>${box.contents}</p>
          </body>
        </html>
      `;

            try {
                const { uri } = await Print.printToFileAsync({ html });
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            } catch (error) {
                Alert.alert('Fehler', 'Konnte Druckauftrag nicht erstellen.');
                console.error(error);
            }
        });
    };

    const handleSpeak = () => {
        if (box?.contents) {
            Speech.speak(`Inhalt von ${box.name}: ${box.contents}`, { language: 'de' });
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#f4511e" />
            </View>
        );
    }

    if (!box) {
        return (
            <View style={styles.center}>
                <Text>Kiste nicht gefunden.</Text>
            </View>
        );
    }

    const qrValue = `lagermanager://box/${box.id}`;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{box.name}</Text>
                    <Link href={`/edit-box?id=${box.id}`} asChild>
                        <TouchableOpacity style={styles.editButtonSmall}>
                            <Text style={styles.editButtonText}>✏️</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
                <Text style={styles.date}>Erstellt: {new Date(box.createdAt).toLocaleDateString()}</Text>

                <View style={styles.divider} />

                <Text style={styles.label}>Inhalt:</Text>
                <Text style={styles.contents}>{box.contents}</Text>

                <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
                    <Text style={styles.speakButtonText}>🔊 Vorlesen</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.qrContainer}>
                <Text style={styles.qrLabel}>QR Code für Etikett:</Text>
                <View style={styles.qrWrapper}>
                    <QRCode
                        value={qrValue}
                        size={200}
                        getRef={(c) => (svgRef.current = c)}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
                <Text style={styles.printButtonText}>🖨️ Etikett drucken / teilen</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Kiste löschen</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        flex: 1,
    },
    editButtonSmall: {
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    editButtonText: {
        fontSize: 18,
    },
    date: {
        fontSize: 14,
        color: '#888',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    contents: {
        fontSize: 18,
        color: '#333',
        lineHeight: 26,
    },
    speakButton: {
        marginTop: 12,
        alignSelf: 'flex-start',
        backgroundColor: '#e0f7fa',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    speakButtonText: {
        color: '#006064',
        fontWeight: 'bold',
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    qrLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 12,
    },
    qrWrapper: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 2,
    },
    printButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    printButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ff4444',
    },
    deleteButtonText: {
        color: '#ff4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
