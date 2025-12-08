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
  // Get client ID from environment (iOS only)
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';

  // Check if iOS client ID is available
  const hasRequiredClientId = Platform.OS === 'ios' && iosClientId;

  // Create the reversed client ID for iOS URL scheme
  // Format: com.googleusercontent.apps.{CLIENT_ID}
  const iosReversedClientId = iosClientId ? iosClientId.split('.').reverse().join('.') : '';

  // Use the reversed client ID as redirect URI for iOS
  const redirectUri = iosReversedClientId
      ? `${iosReversedClientId}:/oauth2redirect/google`
    : undefined;

  // Configure Google Auth request for iOS only
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: iosClientId || undefined,
    scopes: ['profile', 'email'],
    redirectUri: redirectUri,
  });

  const signIn = async () => {
    try {
      // Check if Google Auth is properly configured for iOS
      if (!hasRequiredClientId) {
        throw new Error(
          'Google Sign-In is not configured for iOS. ' +
            'Please set EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID in your environment variables.',
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
