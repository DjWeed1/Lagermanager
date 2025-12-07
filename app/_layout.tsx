import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';

function LogoutButton() {
    const { signOut } = useAuth();
    return (
        <TouchableOpacity onPress={signOut} style={{ marginRight: 16 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
    );
}

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#f4511e" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f0f2f5' }}>
            <View style={{
                flex: 1,
                maxWidth: 600,
                width: '100%',
                alignSelf: 'center',
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 5
            }}>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#f4511e',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        headerRight: user ? () => <LogoutButton /> : undefined,
                    }}
                >
                    <Stack.Screen name="index" options={{ title: 'Meine Räume' }} />
                    <Stack.Screen name="login" options={{ title: 'Anmelden', headerShown: false }} />
                    <Stack.Screen name="register" options={{ title: 'Registrieren', headerShown: false }} />
                    <Stack.Screen name="add-room" options={{ title: 'Neuer Raum', presentation: 'modal' }} />
                    <Stack.Screen name="room/[id]" options={{ title: 'Raum Inhalt' }} />
                    <Stack.Screen name="add-box" options={{ title: 'Neue Kiste', presentation: 'modal' }} />
                    <Stack.Screen name="edit-box" options={{ title: 'Kiste bearbeiten', presentation: 'modal' }} />
                    <Stack.Screen name="box/[id]" options={{ title: 'Kisteninhalt' }} />
                    <Stack.Screen name="scan" options={{ title: 'QR Scan', presentation: 'modal' }} />
                </Stack>
            </View>
        </View>
    );
}

export default function Layout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
