import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
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
  const [showReviewMode, setShowReviewMode] = useState(false);
  const [reviewCode, setReviewCode] = useState('');
  const [reviewModeLoading, setReviewModeLoading] = useState(false);

  // Review mode access code (can be set via environment variable)
  // Default code for App Store review - change this to a secure code
  const REVIEW_ACCESS_CODE = process.env.EXPO_PUBLIC_REVIEW_ACCESS_CODE || 'GOBUDDY-REVIEW-2024';

  // Check if Google Auth is configured before using the hook
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

  const hasRequiredClientId =
    (Platform.OS === 'ios' && iosClientId) ||
    (Platform.OS === 'android' && androidClientId) ||
    (Platform.OS === 'web' && webClientId);

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

  const handleReviewModeLogin = async () => {
    if (!reviewCode.trim()) {
      Alert.alert('Error', 'Please enter a review access code.');
      return;
    }

    if (reviewCode.trim() !== REVIEW_ACCESS_CODE) {
      Alert.alert('Invalid Code', 'The review access code is incorrect.');
      return;
    }

    setReviewModeLoading(true);

    try {
      // Create a review test user
      const reviewUser: User = {
        id: 'review-user-' + Date.now(),
        name: 'App Review Tester',
        email: 'reviewer@gobuddy.app',
        bio: 'This is a test account for App Store review purposes.',
        activityTags: ['Testing', 'Review'],
        preferredTimes: ['Weekday Evenings'],
        campusLocation: 'Central Campus',
        skills: ['Testing'],
        phone: '',
        instagram: '',
      };

      // Try to authenticate with backend (may fail if backend requires UW email)
      try {
        const backendUser = await api.users.googleAuth({
          googleId: reviewUser.id,
          email: reviewUser.email,
          name: reviewUser.name,
          profilePicture: '',
        });

        if (backendUser) {
          onAuthenticated(backendUser);
        } else {
          // Fallback to local user if backend rejects
          onAuthenticated(reviewUser);
        }
      } catch (backendError) {
        // Backend may reject non-UW email, use local user
        onAuthenticated(reviewUser);
      }

      setReviewModeLoading(false);
    } catch (error) {
      setReviewModeLoading(false);
      Alert.alert('Error', 'Failed to initialize review mode. Please try again.');
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

          {!hasRequiredClientId ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={24} color={colors.error || '#ff0000'} />
              <Text style={styles.errorText}>
                Google Sign-In is not configured.{'\n'}
                Please set{' '}
                {Platform.OS === 'ios'
                  ? 'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID'
                  : Platform.OS === 'android'
                    ? 'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID'
                    : 'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'}{' '}
                in your environment variables.
              </Text>
            </View>
          ) : (
            <>
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
            </>
          )}

          {/* Review Mode Access (for App Store Review) */}
          <View style={styles.reviewModeContainer}>
            <TouchableOpacity
              onPress={() => setShowReviewMode(!showReviewMode)}
              style={styles.reviewModeToggle}
            >
              <Text style={styles.reviewModeToggleText}>
                {showReviewMode ? 'Hide' : 'Show'} Review Mode Access
              </Text>
              <Ionicons
                name={showReviewMode ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {showReviewMode && (
              <View style={styles.reviewModeForm}>
                <Text style={styles.reviewModeTitle}>App Store Review Access</Text>
                <Text style={styles.reviewModeSubtitle}>
                  Enter the review access code to test the app without a UW email.
                </Text>
                <TextInput
                  style={styles.reviewCodeInput}
                  placeholder="Enter review access code"
                  placeholderTextColor={colors.textMuted}
                  value={reviewCode}
                  onChangeText={setReviewCode}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Button
                  onPress={handleReviewModeLogin}
                  loading={reviewModeLoading}
                  fullWidth
                  style={styles.reviewModeButton}
                >
                  Access Review Mode
                </Button>
              </View>
            )}
          </View>
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
  errorContainer: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.errorBackground,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error || '#ff0000',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  reviewModeContainer: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  reviewModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  reviewModeToggleText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  reviewModeForm: {
    marginTop: spacing.md,
  },
  reviewModeTitle: {
    ...typography.h4,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  reviewModeSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  reviewCodeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  reviewModeButton: {
    backgroundColor: colors.primary,
  },
});
