import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {User} from '../types';
import {colors, spacing, typography} from '../theme';
import {useGoogleAuth} from '../services/googleAuth';
import api from '../services/api';

type AuthScreenProps = {
  onAuthenticated: (user: User) => void;
};

export function AuthScreen({onAuthenticated}: AuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const {response, getUserInfo, signIn} = useGoogleAuth();

  const handleAuthSuccess = React.useCallback(
    async (accessToken: string) => {
      try {
        const userInfo = await getUserInfo(accessToken);

        // Validate UW email domain
        if (!userInfo.email.endsWith('@uw.edu')) {
          Alert.alert('Invalid Email', 'Please sign in with a valid @uw.edu email address.');
          setLoading(false);
          return;
        }

        // Try to authenticate with backend
        try {
          const backendUser = await api.users.googleAuth({
            googleId: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            profilePicture: userInfo.picture,
          });

          if (backendUser) {
            // User authenticated with backend successfully
            onAuthenticated(backendUser);
          } else {
            throw new Error('Failed to authenticate with backend');
          }
        } catch (backendError) {
          // Backend auth failed, using local user
          // Fallback to local user if backend is not available
          const user: User = {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            bio: '',
            activityTags: [],
            preferredTimes: [],
            campusLocation: '',
            skills: [],
            phone: '',
            instagram: '',
          };
          onAuthenticated(user);
        }

        setLoading(false);
      } catch (error) {
        // Error fetching user info
        Alert.alert('Error', 'Failed to retrieve user information. Please try again.');
        setLoading(false);
      }
    },
    [getUserInfo, onAuthenticated],
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const {authentication} = response;
      if (authentication?.accessToken) {
        handleAuthSuccess(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      setLoading(false);
      Alert.alert('Authentication Error', 'Failed to sign in with Google. Please try again.');
    } else if (response?.type === 'cancel') {
      setLoading(false);
    }
  }, [response, handleAuthSuccess]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
    } catch (error) {
      // Sign-in error
      Alert.alert('Sign-in Error', 'An error occurred during sign-in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>GoBuddy</Text>
          <Text style={styles.subtitle}>Find your activity partners at UW</Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-google" size={48} color={colors.primary} />
          </View>

          <Text style={styles.cardTitle}>Sign in with Google</Text>
          <Text style={styles.cardSubtitle}>Use your @uw.edu account to continue</Text>

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

          <Text style={styles.notice}>Only @uw.edu email addresses are allowed.</Text>
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
