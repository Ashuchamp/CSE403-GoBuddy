import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {User, ActivityIntent, ActivityRequest} from '../types';
import {UserCard} from '../components/UserCard';
import {ActivityCard} from '../components/ActivityCard';
import {ActivityDetailModal} from '../components/ActivityDetailModal';
import {UserProfileModal} from '../components/UserProfileModal';
import {colors, spacing, typography} from '../theme';
import api from '../services/api';
import {
  addSentRequest,
  getSentRequests,
  subscribeToSentRequests,
  getConnectedUsers,
  subscribeToConnectedUsers,
} from '../services/connectionStore';
import {isSeedUser, isDemoMode} from '../utils/seedData';

type BrowseScreenProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  activityRequests?: ActivityRequest[];
  onUserPress?: (user: User) => void;
  onJoinActivity?: (intentId: string) => void;
  onConnectRequest?: (userId: string) => void;
};

type BrowseCategory = 'students' | 'activities';

export function BrowseScreen({
  currentUser,
  activityIntents,
  activityRequests = [],
  onUserPress: _onUserPress,
  onJoinActivity,
  onConnectRequest: _onConnectRequest,
}: BrowseScreenProps) {
  const [browseCategory, setBrowseCategory] = useState<BrowseCategory>('students');
  const [selectedActivity, setSelectedActivity] = useState<ActivityIntent | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [connectModalVisible, setConnectModalVisible] = useState(false);
  const [pendingConnectUser, setPendingConnectUser] = useState<User | null>(null);
  const [connectNote, setConnectNote] = useState('');
  const [sentToUserIds, setSentToUserIds] = useState<Set<string>>(new Set());
  const [receivedFromUserIds, setReceivedFromUserIds] = useState<Set<string>>(new Set());
  const [connectedUserIds, setConnectedUserIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [useBackend, setUseBackend] = useState(true);

  // Check if user is in demo mode
  const isInDemoMode = isDemoMode(currentUser.email);

  // Fetch users and connection data from API
  const fetchData = useCallback(async () => {
    try {
      const allUsers = await api.users.getAll();
      setUsers(allUsers);

      // Fetch connection data from backend
      const [sentRequests, receivedRequests, connectedUsers] = await Promise.all([
        api.connections.getSentRequests(currentUser.id),
        api.connections.getReceivedRequests(currentUser.id),
        api.connections.getConnectedUsers(currentUser.id),
      ]);

      // Update connection status sets
      const sentIds = sentRequests
        .map((r: {to?: {id: string}}) => r.to?.id)
        .filter((id): id is string => !!id);
      setSentToUserIds(new Set(sentIds));

      const receivedIds = receivedRequests
        .map((r: {from?: {id: string}}) => r.from?.id)
        .filter((id): id is string => !!id);
      setReceivedFromUserIds(new Set(receivedIds));
      setConnectedUserIds(new Set(connectedUsers.map((u: User) => u.id)));
      setUseBackend(true);
    } catch (error) {
      console.error('Failed to fetch data from backend:', error);
      // Only use local store fallback in demo mode
      if (isInDemoMode) {
        console.log('Demo mode: Using local store fallback');
        setUseBackend(false);
        setUsers([]);
        setSentToUserIds(new Set(getSentRequests().map((r) => r.to.id)));
        setConnectedUserIds(new Set(getConnectedUsers().map((u) => u.id)));
      } else {
        // Normal mode: show empty state
        setUsers([]);
        setSentToUserIds(new Set());
        setReceivedFromUserIds(new Set());
        setConnectedUserIds(new Set());
        setUseBackend(true);
      }
    }
  }, [currentUser.id, isInDemoMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  // Subscribe to local store updates if not using backend
  React.useEffect(() => {
    if (!useBackend) {
      const unsubscribe1 = subscribeToSentRequests((r) => {
        setSentToUserIds((prev) => new Set(prev).add(r.to.id));
      });
      const unsubscribe2 = subscribeToConnectedUsers((u) => {
        setConnectedUserIds((prev) => new Set(prev).add(u.id));
      });
      return () => {
        unsubscribe1();
        unsubscribe2();
      };
    }
  }, [useBackend]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!currentUser?.id) return [];

    const q = searchQuery.trim().toLowerCase();
    return (
      users
        .filter((user) => user.id !== currentUser.id)
        // In normal mode, filter out seed users; in demo mode, show all
        .filter((user) => isInDemoMode || !isSeedUser(user.email))
        // Exclude users already connected, with pending requests sent, or who sent you requests
        .filter((user) => !connectedUserIds.has(user.id))
        .filter((user) => !sentToUserIds.has(user.id))
        .filter((user) => !receivedFromUserIds.has(user.id))
        .filter((user) => {
          if (!q) return true;
          const haystack = [user.name, user.bio, user.campusLocation ?? '', ...user.activityTags]
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        })
    );
  }, [
    currentUser,
    searchQuery,
    users,
    connectedUserIds,
    sentToUserIds,
    receivedFromUserIds,
    isInDemoMode,
  ]);

  // User's participating requests
  const myRequestsByActivity = useMemo(() => {
    const map = new Map<string, ActivityRequest>();
    activityRequests
      .filter((r) => r.userId === currentUser.id)
      .forEach((r) => {
        map.set(r.activityId, r);
      });
    return map;
  }, [activityRequests, currentUser.id]);

  // Filter activities
  const filteredIntents = useMemo(() => {
    if (!currentUser?.id) return [];

    const q = searchQuery.trim().toLowerCase();
    return (
      activityIntents
        .filter((intent) => intent.userId !== currentUser.id)
        // In normal mode, filter out activities created by seed users; in demo mode, show all
        .filter((intent) => {
          // We need to check if the activity creator is a seed user
          // Since we don't have the creator's email directly, we'll need to find the user
          // For now, we'll filter based on userName matching seed user patterns
          // A better approach would be to have userId -> email mapping, but for now
          // we'll check if we can find the user in our users list
          if (isInDemoMode) return true;
          const creator = users.find((u) => u.id === intent.userId);
          return !creator || !isSeedUser(creator.email);
        })
        // Exclude activities where user has pending or approved requests
        .filter((intent) => {
          const req = myRequestsByActivity.get(intent.id);
          return !req || req.status === 'declined';
        })
        .filter((intent) => {
          if (!q) return true;
          const haystack = [
            intent.title,
            intent.description,
            intent.userName,
            intent.campusLocation ?? '',
            ...(intent.scheduledTimes ?? []),
          ]
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        })
    );
  }, [currentUser, activityIntents, searchQuery, myRequestsByActivity, users, isInDemoMode]);

  const openConnectModal = (user: User) => {
    setPendingConnectUser(user);
    setConnectNote('');
    setConnectModalVisible(true);
  };

  const submitConnectRequest = async () => {
    if (!pendingConnectUser) return;

    if (useBackend) {
      // Use backend API
      try {
        await api.connections.sendRequest(
          currentUser.id,
          pendingConnectUser.id,
          connectNote.trim(),
        );
        // Update local state
        setSentToUserIds((prev) => new Set(prev).add(pendingConnectUser.id));
      } catch (error) {
        console.error('Failed to send connection request:', error);
      }
    } else {
      // Use local store (only in demo mode)
      if (isInDemoMode) {
        addSentRequest({
          id: `sent_${Date.now()}`,
          from: currentUser,
          to: pendingConnectUser,
          message: connectNote.trim(),
          timestamp: new Date(),
          status: 'pending',
        });
      }
    }

    setConnectModalVisible(false);
    setPendingConnectUser(null);
    setConnectNote('');
  };

  const renderUserCard = ({item}: {item: User}) => (
    <UserCard
      user={item}
      currentUser={currentUser}
      onPress={() => setSelectedUser(item)}
      requested={sentToUserIds.has(item.id)}
      received={receivedFromUserIds.has(item.id)}
      connected={connectedUserIds.has(item.id)}
      onConnectRequest={() => openConnectModal(item)}
      showContactInfo={false}
    />
  );

  const renderActivityCard = ({item}: {item: ActivityIntent}) => {
    const req = myRequestsByActivity.get(item.id);
    // Treat declined requests as if they don't exist (allow re-request)
    const status =
      req?.status === 'approved' ? 'joined' : req?.status === 'pending' ? 'sent' : undefined;
    return (
      <ActivityCard
        intent={item}
        onJoin={onJoinActivity}
        onPress={(activity) => {
          setSelectedActivity(activity);
        }}
        {...(status ? {joinStatus: status} : {})}
      />
    );
  };

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
            color={browseCategory === 'students' ? '#fff' : colors.textSecondary}
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
            color={browseCategory === 'activities' ? '#fff' : colors.textSecondary}
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

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={
            browseCategory === 'students'
              ? 'Search students by name, tags, location'
              : 'Search activities by title, description, host, location'
          }
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
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
              {filteredUsers.length} {filteredUsers.length === 1 ? 'student' : 'students'} found
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
              {filteredIntents.length} {filteredIntents.length === 1 ? 'activity' : 'activities'}{' '}
              found
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
        showContactInfo={selectedUser ? connectedUserIds.has(selectedUser.id) : false}
      />

      {/* Connect Note Modal */}
      <Modal
        visible={connectModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setConnectModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add a note</Text>
              <Text style={styles.modalSubtitle}>Why do you want to connect?</Text>
              <TextInput
                value={connectNote}
                onChangeText={setConnectNote}
                placeholder="Write a short note (optional)"
                placeholderTextColor={colors.textMuted}
                style={styles.textInput}
                multiline
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setConnectModalVisible(false)}
                  style={styles.modalButtonSecondary}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={submitConnectRequest} style={styles.modalButtonPrimary}>
                  <Text style={styles.modalButtonPrimaryText}>Send Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.text,
    paddingVertical: spacing.sm,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  textInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.md,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  modalButtonSecondary: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonSecondaryText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  modalButtonPrimaryText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '700',
  },
});
