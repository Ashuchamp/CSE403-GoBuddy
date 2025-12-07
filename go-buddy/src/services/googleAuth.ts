import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {Platform} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export const useGoogleAuth = () => {
  // Get client IDs from environment
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

  // Check if required client ID is available for current platform
  const hasRequiredClientId =
    (Platform.OS === 'ios' && iosClientId) ||
    (Platform.OS === 'android' && androidClientId) ||
    (Platform.OS === 'web' && webClientId);

  // Create the reversed client ID for iOS URL scheme
  // Format: com.googleusercontent.apps.{CLIENT_ID}
  const iosReversedClientId = iosClientId ? iosClientId.split('.').reverse().join('.') : '';

  // Use the proper redirect URI
  // For iOS: use reversed client ID scheme
  // For Android: let expo-auth-session handle it automatically (it uses the AndroidManifest scheme)
  const redirectUri =
    Platform.OS === 'ios' && iosReversedClientId
      ? `${iosReversedClientId}:/oauth2redirect/google`
      : undefined; // Let expo-auth-session handle it automatically for Android

  // Call useAuthRequest - we must provide a valid client ID for Android to prevent crash
  // If missing, provide a placeholder that will fail gracefully during sign-in
  // Note: expo-auth-session validates androidClientId on Android during hook initialization
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: iosClientId || undefined,
    // For Android, we must provide a value or the hook will crash
    // Use a placeholder that looks valid but will fail during actual auth
    androidClientId: androidClientId || (Platform.OS === 'android' ? '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com' : undefined),
    webClientId: webClientId || undefined,
    scopes: ['profile', 'email'],
    redirectUri: redirectUri,
  });

  const signIn = async () => {
    try {
      // Check if Google Auth is properly configured
      if (!hasRequiredClientId) {
        const platformName = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web';
        const envVarName = Platform.OS === 'ios' 
          ? 'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'
          : Platform.OS === 'android'
          ? 'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID'
          : 'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID';
        throw new Error(
          `Google Sign-In is not configured for ${platformName}. Please set ${envVarName} in your environment variables.`,
        );
      }
      const result = await promptAsync();
      return result;
    } catch (error) {
      // console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const getUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      // console.error('Error fetching user info:', error);
      throw error;
    }
  };

  return {
    request,
    response,
    signIn,
    getUserInfo,
  };
};
