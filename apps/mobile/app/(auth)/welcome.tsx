import { View, Text, StyleSheet } from 'react-native';

/**
 * Welcome Screen Placeholder
 * Will be implemented in Phase 1B
 */
export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Gossip</Text>
            <Text style={styles.subtext}>Phase 1B placeholder</Text>
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
        color: '#666',
        fontSize: 14,
        marginTop: 8,
    },
});
