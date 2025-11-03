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
  // Get iOS client ID from environment
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
  
  // Create the reversed client ID for iOS URL scheme
  // Format: com.googleusercontent.apps.{CLIENT_ID}
  const reversedClientId = iosClientId.split('.').reverse().join('.');
  
  // Use the proper redirect URI for iOS
  const redirectUri = Platform.OS === 'ios' 
    ? `${reversedClientId}:/oauth2redirect/google`
    : undefined; // Let expo-auth-session handle it for other platforms

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri: redirectUri,
  });

  const signIn = async () => {
    try {
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
