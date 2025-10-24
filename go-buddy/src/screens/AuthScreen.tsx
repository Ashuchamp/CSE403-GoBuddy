import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { User } from '../types';
import { colors, spacing, typography } from '../theme';

type AuthScreenProps = {
  onAuthenticated: (user: User) => void;
};

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendMagicLink = () => {
    // Validate UW email
    if (!email.endsWith('@uw.edu')) {
      Alert.alert('Invalid Email', 'Please use a valid UW email address (@uw.edu)');
      return;
    }

    setLoading(true);
    // Simulate sending magic link
    setTimeout(() => {
      setLoading(false);
      setLinkSent(true);
    }, 1000);
  };

  const handleSimulateLogin = () => {
    // Mock user data for demo
    const mockUser: User = {
      id: '1',
      email: email,
      name: 'Demo User',
      bio: "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
      skills: ['Python', 'React', 'Data Structures'],
      preferredTimes: ['Weekday Evenings', 'Weekend Mornings'],
      activityTags: ['Gym', 'Study Groups', 'Soccer', 'CSE 373'],
      phone: '206-555-0123',
      instagram: '@demouser',
      campusLocation: 'North Campus',
    };
    onAuthenticated(mockUser);
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

        {!linkSent ? (
          <Card style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={48} color={colors.primary} />
            </View>

            <Text style={styles.cardTitle}>Sign in with your UW email</Text>
            <Text style={styles.cardSubtitle}>
              We'll send you a magic link to sign in
            </Text>

            <Input
              placeholder="yourname@uw.edu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.inputContainer}
            />

            <Button
              onPress={handleSendMagicLink}
              loading={loading}
              fullWidth
            >
              Send Magic Link
            </Button>

            <Text style={styles.notice}>
              Only @uw.edu email addresses are allowed
            </Text>
          </Card>
        ) : (
          <Card style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            </View>

            <Text style={styles.cardTitle}>Check your email!</Text>
            <Text style={styles.cardSubtitle}>
              We've sent a magic link to{' '}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <Text style={styles.instruction}>
              Click the link in the email to complete your sign in.
            </Text>

            {/* Demo button - remove in production */}
            <View style={styles.demoSection}>
              <Text style={styles.demoLabel}>Demo Mode</Text>
              <Button
                onPress={handleSimulateLogin}
                variant="outline"
                fullWidth
              >
                Login
              </Button>
            </View>
          </Card>
        )}
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
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  notice: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  emailText: {
    color: colors.primary,
    fontWeight: '600',
  },
  instruction: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  demoSection: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});

