import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../src/store';

/**
 * OTP Verification Screen Placeholder
 * Will be implemented in Phase 1B
 */
export default function OtpScreen() {
    const user = useAuthStore((state) => state.user);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Verify Your Email</Text>
            <Text style={styles.subtext}>
                {user && 'email' in user ? user.email : 'Enter OTP'}
            </Text>
            <Text style={styles.placeholder}>Phase 1B placeholder</Text>
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
        marginTop: 8,
    },
    placeholder: {
        color: '#666',
        fontSize: 14,
        marginTop: 24,
    },
});
