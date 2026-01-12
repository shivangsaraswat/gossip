import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuthStore } from '../../src/store';
import type { User } from '../../src/types';

/**
 * Home Screen Placeholder
 * Will be implemented in later phases
 */
export default function HomeScreen() {
    const user = useAuthStore((state) => state.user) as User | null;
    const logout = useAuthStore((state) => state.logout);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome, {user?.displayName || 'User'}!</Text>
            <Text style={styles.subtext}>@{user?.username}</Text>

            <Pressable style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtext: {
        color: '#aaa',
        fontSize: 16,
        marginTop: 4,
    },
    button: {
        marginTop: 32,
        backgroundColor: '#333',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
