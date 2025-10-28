import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, ActivityIntent } from '../types';
import { mockUsers } from '../data/mockUsers';
import { UserCard } from '../components/UserCard';
import { ActivityCard } from '../components/ActivityCard';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import { UserProfileModal } from '../components/UserProfileModal';
import { colors, spacing, typography } from '../theme';

type BrowseScreenProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  onUserPress?: (user: User) => void;
  onJoinActivity?: (intentId: string) => void;
  onConnectRequest?: (userId: string) => void;
};

type BrowseCategory = 'students' | 'activities';

export function BrowseScreen({
  currentUser,
  activityIntents,
  onUserPress,
  onJoinActivity,
  onConnectRequest,
}: BrowseScreenProps) {
  const [browseCategory, setBrowseCategory] =
    useState<BrowseCategory>('students');
  const [selectedActivity, setSelectedActivity] = useState<ActivityIntent | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => user.id !== currentUser.id);
  }, [currentUser.id]);

  // Filter activities
  const filteredIntents = useMemo(() => {
    return activityIntents.filter(
      (intent) => intent.userId !== currentUser.id
    );
  }, [currentUser.id, activityIntents]);

  const renderUserCard = ({ item }: { item: User }) => (
    <UserCard
      user={item}
      currentUser={currentUser}
      onPress={() => setSelectedUser(item)}
      showContactInfo={false} // Contact info hidden in Browse
    />
  );

  const renderActivityCard = ({ item }: { item: ActivityIntent }) => (
    <ActivityCard 
      intent={item} 
      onJoin={onJoinActivity}
      onPress={(activity) => {
        console.log('BrowseScreen: Activity pressed:', activity.title);
        setSelectedActivity(activity);
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Browse</Text>
        <Text style={styles.subtitle}>
          {browseCategory === 'students'
            ? 'Find your next study buddy or activity partner'
            : 'Discover activities to join'}
        </Text>
      </View>

      {/* Category Toggle */}
      <View style={styles.categoryToggle}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            browseCategory === 'students' && styles.categoryButtonActive,
          ]}
          onPress={() => setBrowseCategory('students')}
        >
          <Ionicons
            name="people-outline"
            size={20}
            color={
              browseCategory === 'students' ? '#fff' : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.categoryText,
              browseCategory === 'students' && styles.categoryTextActive,
            ]}
          >
            Students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            browseCategory === 'activities' && styles.categoryButtonActive,
          ]}
          onPress={() => setBrowseCategory('activities')}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={
              browseCategory === 'activities' ? '#fff' : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.categoryText,
              browseCategory === 'activities' && styles.categoryTextActive,
            ]}
          >
            Activities
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {browseCategory === 'students' ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {filteredUsers.length}{' '}
              {filteredUsers.length === 1 ? 'student' : 'students'} found
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No students found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredIntents}
          renderItem={renderActivityCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {filteredIntents.length}{' '}
              {filteredIntents.length === 1 ? 'activity' : 'activities'} found
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No activities found</Text>
            </View>
          }
        />
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        visible={selectedActivity !== null}
        onClose={() => {
          console.log('BrowseScreen: Closing modal');
          setSelectedActivity(null);
        }}
        currentUserId={currentUser.id}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        visible={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        currentUserId={currentUser.id}
        showContactInfo={false} // Contact info hidden in Browse
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
  categoryToggle: {
    flexDirection: 'row',
    margin: spacing.md,
    backgroundColor: colors.borderLight,
    borderRadius: 8,
    padding: 4,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 6,
    gap: spacing.xs,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: spacing.md,
  },
  resultsCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});

