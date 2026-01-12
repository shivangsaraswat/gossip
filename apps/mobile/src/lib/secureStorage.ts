import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'gossip_access_token';
const REFRESH_TOKEN_KEY = 'gossip_refresh_token';

/**
 * Save tokens to secure storage
 * Uses hardware-backed encryption on supported devices
 */
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
        SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
        SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
}

/**
 * Retrieve tokens from secure storage
 * Returns null if no tokens are stored
 */
export async function getTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
    const [accessToken, refreshToken] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);

    if (!accessToken || !refreshToken) {
        return null;
    }

    return { accessToken, refreshToken };
}

/**
 * Clear all tokens from secure storage
 * This fully logs the user out
 */
export async function clearTokens(): Promise<void> {
    await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
}
