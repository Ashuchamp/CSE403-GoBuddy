import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
// import {makeRedirectUri} from 'expo-auth-session'; // Unused for now
// import {Platform} from 'react-native'; // Unused for now

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
  // For Expo Go development, we need to work around the exp:// scheme limitation
  // Use the reversed client ID as the scheme (Google's requirement for iOS)
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
  const reversedClientId = iosClientId.split('.').reverse().join('.');

  const redirectUri = `${reversedClientId}:/oauth2redirect/google`;

  // Debug: Log the configuration
  // console.log('🔍 Google Auth Debug Info:');
  // console.log('Custom Redirect URI:', redirectUri);
  // console.log('Web Client ID:', process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
  // console.log('iOS Client ID:', process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID);
  // console.log('Android Client ID:', process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID);
  // console.log('Platform:', Platform.OS);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri: redirectUri,
  });

  // Log the actual redirect URI being used
  if (request) {
    // console.log('🔍 Actual Redirect URI:', request.redirectUri);
  }

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
