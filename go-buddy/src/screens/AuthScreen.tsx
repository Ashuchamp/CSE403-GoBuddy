import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { User } from '../types';
import { colors, spacing, typography } from '../theme';
import { useGoogleAuth } from '../services/googleAuth';

type AuthScreenProps = {
  onAuthenticated: (user: User) => void;
};

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const { request, response, signIn, getUserInfo } = useGoogleAuth();

  useEffect(() => {
    console.log('📱 Auth Response:', response?.type);
    if (response?.type === 'success') {
      console.log('✅ Authentication successful!');
      const { authentication } = response;
      if (authentication?.accessToken) {
        console.log('🔑 Access token received');
        handleAuthSuccess(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('❌ Authentication error:', response.error);
      setLoading(false);
      Alert.alert('Authentication Error', 'Failed to sign in with Google. Please try again.');
    } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
      console.log('ℹ️ Authentication cancelled by user');
      setLoading(false);
    }
  }, [response]);

  const handleAuthSuccess = async (accessToken: string) => {
    try {
      const googleUserInfo = await getUserInfo(accessToken);
      
      // Validate UW email domain
      if (!googleUserInfo.email.endsWith('@uw.edu')) {
        Alert.alert('Invalid Email', 'Please use a valid UW email address (@uw.edu)');
        setLoading(false);
        return;
      }

      // Create user object from Google data
      const user: User = {
        id: googleUserInfo.id,
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        bio: '',
        skills: [],
        preferredTimes: [],
        activityTags: [],
        phone: '',
        instagram: '',
        campusLocation: '',
      };

      onAuthenticated(user);
    } catch (error) {
      console.error('Error processing authentication:', error);
      Alert.alert('Authentication Error', 'Failed to complete sign in. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!request) {
      Alert.alert('Error', 'Google Sign-In is not configured properly. Please check your environment variables.');
      return;
    }

    console.log('🚀 Starting Google Sign-In...');
    setLoading(true);
    try {
      await signIn();
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      Alert.alert('Authentication Error', 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>GoBuddy</Text>
          <Text style={styles.subtitle}>Find your activity partners at UW</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-google" size={48} color={colors.primary} />
          </View>

          <Text style={styles.cardTitle}>Sign in with Google</Text>
          <Text style={styles.cardSubtitle}>
            Use your UW Google account to continue
          </Text>

          <Button
            onPress={handleGoogleSignIn}
            loading={loading}
            fullWidth
            style={styles.googleButton}
          >
            <View style={styles.googleButtonContent}>
              <Ionicons name="logo-google" size={20} color="#fff" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </Text>
            </View>
          </Button>

          <Text style={styles.notice}>
            Only @uw.edu email addresses are allowed
          </Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    padding: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  googleButton: {
    backgroundColor: colors.primary,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: spacing.sm,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notice: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

