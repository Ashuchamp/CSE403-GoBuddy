import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User, ActivityIntent, ActivityRequest} from '../types';
import {ActivityCard} from '../components/ActivityCard';
import {ActivityDetailModal} from '../components/ActivityDetailModal';
import {colors, spacing, typography} from '../theme';

type RecommendationsScreenProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  activityRequests?: ActivityRequest[];
  onJoinActivity?: (intentId: string) => void;
};

export function RecommendationsScreen({
  currentUser,
  activityIntents,
  activityRequests = [],
  onJoinActivity,
}: RecommendationsScreenProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityIntent | null>(null);

  // Map of user's requests by activity ID
  const myRequestsByActivity = useMemo(() => {
    const map = new Map<string, ActivityRequest>();
    activityRequests
      .filter((r) => r.userId === currentUser.id)
      .forEach((r) => {
        map.set(r.activityId, r);
      });
    return map;
  }, [activityRequests, currentUser.id]);

  // Recommendation: show activities except user's own and exclude joined/pending requests
  const recommendations = useMemo(() => {
    return activityIntents.filter((intent) => {
      // Exclude user's own activities
      if (intent.userId === currentUser.id) return false;

      // Exclude completed/cancelled activities
      if (intent.status === 'completed' || intent.status === 'cancelled') return false;

      // Exclude activities where user has pending or approved requests
      const req = myRequestsByActivity.get(intent.id);
      if (req && (req.status === 'pending' || req.status === 'approved')) return false;

      return true;
    });
  }, [activityIntents, currentUser.id, myRequestsByActivity]);

  const renderActivityCard = ({item}: {item: ActivityIntent}) => (
    <ActivityCard intent={item} onJoin={onJoinActivity} onPress={setSelectedActivity} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>For You</Text>
        <Text style={styles.subtitle}>Activities matched to your interests</Text>
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

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        visible={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
        currentUserId={currentUser.id}
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
