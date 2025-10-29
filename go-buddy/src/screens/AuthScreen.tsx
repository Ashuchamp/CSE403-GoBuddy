import React, {useState} from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {User} from '../types';
import {colors, spacing, typography} from '../theme';
// import {useGoogleAuth} from '../services/googleAuth'; // Disabled for demo mode

type AuthScreenProps = {
  onAuthenticated: (user: User) => void;
};

export function AuthScreen({onAuthenticated}: AuthScreenProps) {
  const [loading, setLoading] = useState(false);
  // const {response, getUserInfo} = useGoogleAuth(); // Disabled for demo mode

  // useEffect removed - not needed for demo mode

  const handleGoogleSignIn = async () => {
    // For demo purposes, create a mock user instead of using Google Auth
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const mockUser: User = {
        id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@uw.edu',
        bio: 'Student at University of Washington',
        activityTags: ['Study Groups', 'Social Events'],
        preferredTimes: ['Evenings', 'Weekends'],
        campusLocation: 'Seattle Campus',
        skills: ['Collaboration', 'Leadership'],
        phone: '',
        instagram: '',
      };

      onAuthenticated(mockUser);
      setLoading(false);
    }, 1000);
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

          <Text style={styles.cardTitle}>Demo Login</Text>
          <Text style={styles.cardSubtitle}>Click to sign in as a demo user</Text>

          <Button
            onPress={handleGoogleSignIn}
            loading={loading}
            fullWidth
            style={styles.googleButton}
          >
            <View style={styles.googleButtonContent}>
              <Ionicons name="logo-google" size={20} color="#fff" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>
                {loading ? 'Signing in...' : 'Demo Login'}
              </Text>
            </View>
          </Button>

          <Text style={styles.notice}>Demo mode - no real authentication required</Text>
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

