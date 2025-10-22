import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, ActivityIntent } from '../types';
import { ActivityCard } from '../components/ActivityCard';
import { colors, spacing, typography } from '../theme';

type RecommendationsScreenProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  onJoinActivity?: (intentId: string) => void;
};

export function RecommendationsScreen({
  currentUser,
  activityIntents,
  onJoinActivity,
}: RecommendationsScreenProps) {
  // Simple recommendation: activities matching user's tags
  const recommendations = activityIntents.filter((intent) => {
    if (intent.userId === currentUser.id) return false;
    return intent.tags.some((tag) =>
      currentUser.activityTags.some((userTag) =>
        tag.toLowerCase().includes(userTag.toLowerCase())
      )
    );
  });

  const renderActivityCard = ({ item }: { item: ActivityIntent }) => (
    <ActivityCard intent={item} onJoin={onJoinActivity} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>For You</Text>
        <Text style={styles.subtitle}>
          Activities matched to your interests
        </Text>
      </View>

      <FlatList
        data={recommendations}
        renderItem={renderActivityCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="sparkles-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubtext}>
              Update your profile to see personalized recommendations
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});

