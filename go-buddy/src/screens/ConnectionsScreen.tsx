import React, {useMemo} from 'react';
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
import api from '../services/api';

type ConnectionRequest = {
  id: string;
  from: User;
  to?: User; // For sent requests
  message?: string;
  timestamp: Date | string; // Date from local store, string from API
  status: 'pending' | 'accepted' | 'declined';
};

type ConnectionsScreenProps = {
  currentUser: User;
};

type SectionType = 'received' | 'sent' | 'connected';

export function ConnectionsScreen({currentUser}: ConnectionsScreenProps) {
  const [receivedRequests, setReceivedRequests] = React.useState<ConnectionRequest[]>([]);
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
  const [useBackend, setUseBackend] = React.useState(true);

  // Try to fetch connection data from backend
  React.useEffect(() => {
    if (currentUser?.id) {
      fetchConnectionData();
    }
  }, [currentUser?.id]);

  const fetchConnectionData = async () => {
    try {
      const [received, sent, connected] = await Promise.all([
        api.connections.getReceivedRequests(currentUser.id),
        api.connections.getSentRequests(currentUser.id),
        api.connections.getConnectedUsers(currentUser.id),
      ]);

      setReceivedRequests(received);
      setSentRequests(sent);
      setConnectedUsers(connected);
      setUseBackend(true);
    } catch (error) {
      console.error('Failed to fetch connection data from backend, using local store:', error);
      setUseBackend(false);
      // Fall back to local store data
      setSentRequests(
        getSentRequests().map((r) => ({
          id: r.id,
          from: r.from,
          to: r.to,
          message: r.message,
          timestamp: r.timestamp,
          status: r.status,
        })),
      );
      setConnectedUsers(getConnectedUsers());
    }
  };

  React.useEffect(() => {
    // Subscribe to local store updates if not using backend
    if (!useBackend) {
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
    }
  }, [useBackend]);

  const handleAccept = async (requestId: string) => {
    const request = receivedRequests.find((req) => req.id === requestId);
    if (!request) return;

    if (useBackend) {
      // Use API if connected to backend
      try {
        await api.connections.acceptRequest(requestId);
        // Refresh connection data
        await fetchConnectionData();
        Alert.alert('Success', 'Connection request accepted!');
      } catch (error) {
        Alert.alert('Error', 'Failed to accept connection request');
      }
    } else {
      // Use local store if not connected
      setConnectedUsers([request.from, ...connectedUsers]);
      addConnectedUser(request.from, true);
      setReceivedRequests(receivedRequests.filter((req) => req.id !== requestId));
      Alert.alert('Success', 'Connection request accepted!');
    }
  };

  const handleDecline = async (requestId: string) => {
    if (useBackend) {
      // Use API if connected to backend
      try {
        await api.connections.declineRequest(requestId);
        // Refresh connection data
        await fetchConnectionData();
      } catch (error) {
        Alert.alert('Error', 'Failed to decline connection request');
      }
    } else {
      // Use local store if not connected
      setReceivedRequests(receivedRequests.filter((req) => req.id !== requestId));
    }
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

  // Filter out current user from all lists
  const filteredReceivedRequests = useMemo(
    () => receivedRequests.filter((req) => req.from.id !== currentUser.id),
    [receivedRequests, currentUser.id],
  );
  const filteredSentRequests = useMemo(
    () => sentRequests.filter((req) => req.to && req.to.id !== currentUser.id),
    [sentRequests, currentUser.id],
  );
  const filteredConnectedUsers = useMemo(
    () => connectedUsers.filter((user) => user.id !== currentUser.id),
    [connectedUsers, currentUser.id],
  );

  const renderList = () => {
    switch (activeSection) {
      case 'received':
        return (
          <FlatList
            data={filteredReceivedRequests}
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
            data={filteredSentRequests}
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
            data={filteredConnectedUsers}
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
          {filteredReceivedRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filteredReceivedRequests.length}</Text>
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
          {filteredSentRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filteredSentRequests.length}</Text>
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
          {filteredConnectedUsers.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filteredConnectedUsers.length}</Text>
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

function formatTimestamp(date: Date | string): string {
  const now = new Date();
  const timestamp = typeof date === 'string' ? new Date(date) : date;

  // Handle invalid dates
  if (isNaN(timestamp.getTime())) {
    return 'Recently';
  }

  const diff = now.getTime() - timestamp.getTime();
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
