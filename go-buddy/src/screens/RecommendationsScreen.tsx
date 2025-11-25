import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User, ActivityIntent, ActivityRequest} from '../types';
import {ActivityCard} from '../components/ActivityCard';
import {ActivityDetailModal} from '../components/ActivityDetailModal';
import {colors, spacing, typography} from '../theme';
import api from '../services/api';

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
  const [recommendations, setRecommendations] = useState<ActivityIntent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ML-powered recommendations when component mounts or user changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const recs = await api.activities.getRecommendations(currentUser.id, 10);
        console.log(`✅ Loaded ${recs.length} AI-powered recommendations for ${currentUser.name}`);
        if (recs.length > 0) {
          console.log(
            `📊 Top recommendation: ${recs[0].title} (Score: ${recs[0].recommendationScore?.toFixed(1) || 'N/A'})`,
          );
        }
        setRecommendations(recs);
      } catch (err) {
        console.error('❌ Error fetching AI recommendations:', err);
        setError('Failed to load AI recommendations');
        // Fallback to local filtering if API fails
        console.log('⚠️ Falling back to local activity filtering');
        const fallbackRecs = activityIntents.filter((intent) => {
          if (intent.userId === currentUser.id) return false;
          if (intent.status === 'completed' || intent.status === 'cancelled') return false;
          const req = activityRequests.find(
            (r) => r.activityId === intent.id && r.userId === currentUser.id,
          );
          if (req && (req.status === 'pending' || req.status === 'approved')) return false;
          return true;
        });
        setRecommendations(fallbackRecs);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser.id, activityIntents, activityRequests]);

  const renderActivityCard = ({item}: {item: ActivityIntent}) => (
    <ActivityCard intent={item} onJoin={onJoinActivity} onPress={setSelectedActivity} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>For You</Text>
        <Text style={styles.subtitle}>
          {loading
            ? 'Finding personalized activities...'
            : 'AI-powered recommendations based on your interests'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding the best activities for you...</Text>
        </View>
      ) : (
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
                {error || 'Update your profile to see personalized recommendations'}
              </Text>
            </View>
          }
        />
      )}

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
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
