import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function Scan() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Wir brauchen deine Erlaubnis, um die Kamera zu benutzen.</Text>
                <Button onPress={requestPermission} title="Erlaubnis erteilen" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;

        // Check if data is a valid ID or deep link
        // Expected format: "lagermanager://box/<id>" or just "<id>"
        let boxId = data;
        if (data.startsWith('lagermanager://box/')) {
            boxId = data.replace('lagermanager://box/', '');
        }

        // Basic validation (UUID length is usually 36)
        if (boxId.length > 0) {
            setScanned(true);
            router.replace(`/box/${boxId}`);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.scanFrame} />
                    <Text style={styles.overlayText}>Scanne den QR Code auf der Kiste</Text>
                </View>
            </CameraView>

            {scanned && (
                <View style={styles.resetContainer}>
                    <Button title="Nochmal scannen" onPress={() => setScanned(false)} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
        fontWeight: 'bold',
    },
    resetContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
});
