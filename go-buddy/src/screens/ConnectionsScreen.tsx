import React from 'react';
import {View, Text, StyleSheet, FlatList, Alert, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User} from '../types';
import {Card} from '../components/Card';
import {Button} from '../components/Button';
import {UserProfileModal} from '../components/UserProfileModal';
import {colors, spacing, typography} from '../theme';
import {
  getSentRequests,
  subscribeToSentRequests,
  addConnectedUser,
  getConnectedUsers,
} from '../services/connectionStore';

type ConnectionRequest = {
  id: string;
  from: User;
  to?: User; // For sent requests
  message?: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined';
};

type ConnectionsScreenProps = {
  currentUser: User;
};

type SectionType = 'received' | 'sent' | 'connected';

// Mock connection requests
const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    from: {
      id: '3',
      email: 'mike.chen@uw.edu',
      name: 'Mike Chen',
      bio: 'CSE major who loves basketball and coding. Always down to work on side projects!',
      skills: ['Java', 'C++', 'Machine Learning', 'iOS Development'],
      preferredTimes: ['Weekday Afternoons', 'Weekend Mornings'],
      activityTags: ['Basketball', 'CSE 373', 'Coding Projects', 'Gym', 'Gaming'],
      phone: '425-555-0198',
      instagram: '@mikechen_dev',
      campusLocation: 'North Campus',
    },
    message: "Hey! I saw you're also interested in CSE 373 study groups. Want to team up?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending',
  },
];

// No mock sent requests here; rely on shared store seeding to avoid duplicates

// Connected users are sourced from the shared store

export function ConnectionsScreen({currentUser}: ConnectionsScreenProps) {
  const [receivedRequests, setReceivedRequests] = React.useState(mockConnectionRequests);
  const [sentRequests, setSentRequests] = React.useState<ConnectionRequest[]>(
    getSentRequests().map((r) => ({
      id: r.id,
      from: r.from,
      to: r.to,
      message: r.message,
      timestamp: r.timestamp,
      status: r.status,
    })),
  );
  const [connectedUsers, setConnectedUsers] = React.useState<User[]>(getConnectedUsers());
  const [activeSection, setActiveSection] = React.useState<SectionType>('received');
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [profileVisible, setProfileVisible] = React.useState(false);

  // No local seeding here; AppNavigator seeds demo data in the shared store

  React.useEffect(() => {
    const unsubscribe = subscribeToSentRequests((r) => {
      setSentRequests((prev) => [
        {
          id: r.id,
          from: r.from,
          to: r.to,
          message: r.message,
          timestamp: r.timestamp,
          status: r.status,
        },
        ...prev,
      ]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAccept = (requestId: string) => {
    const request = receivedRequests.find((req) => req.id === requestId);
    if (request) {
      // Move user from pending to connected
      setConnectedUsers([request.from, ...connectedUsers]);
      addConnectedUser(request.from, true);
      // Remove from pending requests
      setReceivedRequests(receivedRequests.filter((req) => req.id !== requestId));
      Alert.alert('Success', 'Connection request accepted!');
    }
  };

  const handleDecline = (requestId: string) => {
    setReceivedRequests(receivedRequests.filter((req) => req.id !== requestId));
  };

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setProfileVisible(true);
  };

  const renderReceivedRequest = ({item}: {item: ConnectionRequest}) => {
    return (
      <Card style={styles.requestCard}>
        <TouchableOpacity onPress={() => handleViewProfile(item.from)} style={styles.requestHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.from.name.charAt(0)}</Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>{item.from.name}</Text>
            <Text style={styles.requestTime}>{formatTimestamp(item.timestamp)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {item.message && <Text style={styles.message}>{item.message}</Text>}

        <View style={styles.actionsRow}>
          <Button onPress={() => handleAccept(item.id)} style={styles.acceptButton}>
            Accept
          </Button>
          <Button
            onPress={() => handleDecline(item.id)}
            variant="outline"
            style={styles.declineButton}
          >
            Decline
          </Button>
        </View>
      </Card>
    );
  };

  const renderSentRequest = ({item}: {item: ConnectionRequest}) => {
    const targetUser = item.to;
    if (!targetUser) return null;

    return (
      <Card style={styles.requestCard}>
        <TouchableOpacity
          onPress={() => handleViewProfile(targetUser)}
          style={styles.requestHeader}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{targetUser.name.charAt(0)}</Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>{targetUser.name}</Text>
            <Text style={styles.requestTime}>{formatTimestamp(item.timestamp)}</Text>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>Pending</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {item.message && <Text style={styles.message}>{item.message}</Text>}
      </Card>
    );
  };

  const renderConnectedUser = ({item}: {item: User}) => {
    return (
      <Card style={styles.requestCard}>
        <TouchableOpacity onPress={() => handleViewProfile(item)} style={styles.requestHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>{item.name}</Text>
            <Text style={styles.requestTime}>Connected</Text>
          </View>
          <View style={styles.connectedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </Card>
    );
  };

  const renderEmptyState = (message: string, submessage: string) => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={colors.textMuted} />
      <Text style={styles.emptyText}>{message}</Text>
      <Text style={styles.emptySubtext}>{submessage}</Text>
    </View>
  );

  const renderList = () => {
    switch (activeSection) {
      case 'received':
        return (
          <FlatList
            data={receivedRequests}
            renderItem={renderReceivedRequest}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState(
              'No pending requests',
              'New connection requests will appear here',
            )}
          />
        );
      case 'sent':
        return (
          <FlatList
            data={sentRequests}
            renderItem={renderSentRequest}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState(
              'No sent requests',
              "You haven't sent any connection requests",
            )}
          />
        );
      case 'connected':
        return (
          <FlatList
            data={connectedUsers}
            renderItem={renderConnectedUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState(
              'No connections',
              'Your connected users will appear here',
            )}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connections</Text>
        <Text style={styles.subtitle}>Manage your connection requests</Text>
      </View>

      {/* Section Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeSection === 'received' && styles.activeTab]}
          onPress={() => setActiveSection('received')}
        >
          <Text style={[styles.tabText, activeSection === 'received' && styles.activeTabText]}>
            Received
          </Text>
          {receivedRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{receivedRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeSection === 'sent' && styles.activeTab]}
          onPress={() => setActiveSection('sent')}
        >
          <Text style={[styles.tabText, activeSection === 'sent' && styles.activeTabText]}>
            Sent
          </Text>
          {sentRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{sentRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeSection === 'connected' && styles.activeTab]}
          onPress={() => setActiveSection('connected')}
        >
          <Text style={[styles.tabText, activeSection === 'connected' && styles.activeTabText]}>
            Connected
          </Text>
          {connectedUsers.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{connectedUsers.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {renderList()}

      <UserProfileModal
        user={selectedUser}
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        currentUserId={currentUser.id}
        showContactInfo={activeSection === 'connected'}
      />
    </View>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
  listContent: {
    padding: spacing.md,
  },
  requestCard: {
    marginBottom: spacing.md,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: '#fff',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  requestTime: {
    ...typography.caption,
    color: colors.textMuted,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  acceptButton: {
    flex: 1,
  },
  declineButton: {
    flex: 1,
  },
  pendingBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.xs,
  },
  pendingText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
  connectedBadge: {
    marginRight: spacing.xs,
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
  },
});
