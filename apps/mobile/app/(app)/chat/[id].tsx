import { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer, AppHeader } from '../../../src/components/layout';
import { Avatar } from '../../../src/components/ui';
import { MessageBubble, MessageInput } from '../../../src/components/chat';
import { colors, spacing, typography } from '../../../src/theme';

// Mock data for UI demonstration
const MOCK_MESSAGES = [
    { id: '1', message: 'Hey! How are you?', time: '10:30 AM', isOutgoing: false },
    { id: '2', message: "I'm doing great, thanks! How about you?", time: '10:31 AM', isOutgoing: true },
    { id: '3', message: 'Pretty good! Just finished my morning workout 💪', time: '10:32 AM', isOutgoing: false },
    { id: '4', message: "That's awesome! I need to get back into that routine", time: '10:33 AM', isOutgoing: true },
    { id: '5', message: 'You should! It really helps with energy levels throughout the day', time: '10:35 AM', isOutgoing: false },
];

const MOCK_CONTACT = {
    name: 'John Doe',
    status: 'Online',
};

/**
 * Chat Room Screen
 * Individual chat conversation
 * 
 * Composition:
 * - ScreenContainer
 * - AppHeader (avatar + name)
 * - FlatList with MessageBubble
 * - MessageInput
 */
export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [messages, setMessages] = useState(MOCK_MESSAGES);

    const handleSend = (text: string) => {
        const newMessage = {
            id: String(Date.now()),
            message: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOutgoing: true,
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const initials = MOCK_CONTACT.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

    const headerLeft = (
        <View style={styles.headerLeft}>
            <Avatar initials={initials} size="sm" style={styles.headerAvatar} />
            <View>
                <Text style={styles.headerName}>{MOCK_CONTACT.name}</Text>
                <Text style={styles.headerStatus}>{MOCK_CONTACT.status}</Text>
            </View>
        </View>
    );

    return (
        <ScreenContainer padded={false} edges={['top', 'left', 'right']}>
            <AppHeader showBack leftElement={headerLeft} />

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MessageBubble
                        message={item.message}
                        time={item.time}
                        isOutgoing={item.isOutgoing}
                    />
                )}
                contentContainerStyle={styles.messageList}
                inverted={false}
            />

            <MessageInput onSend={handleSend} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    headerAvatar: {
        marginRight: spacing.sm,
    },
    headerName: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: colors.textPrimary,
    },
    headerStatus: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    messageList: {
        flexGrow: 1,
        paddingVertical: spacing.sm,
    },
});
