import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, typography } from '../theme';

type ConnectionRequest = {
  id: string;
  from: User;
  message?: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined';
};

type ConnectionsScreenProps = {
  currentUser: User;
};

// Mock connection requests
const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    from: {
      id: '3',
      email: 'mike.chen@uw.edu',
      name: 'Mike Chen',
      bio: 'CSE major who loves basketball and coding.',
      skills: ['Java', 'C++', 'Machine Learning'],
      preferredTimes: ['Weekday Afternoons'],
      activityTags: ['Basketball', 'CSE 373'],
      phone: '425-555-0198',
      instagram: '@mikechen_dev',
      campusLocation: 'North Campus',
    },
    message:
      "Hey! I saw you're also interested in CSE 373 study groups. Want to team up?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'pending',
  },
];

export function ConnectionsScreen({ currentUser }: ConnectionsScreenProps) {
  const [requests, setRequests] = React.useState(mockConnectionRequests);

  const handleAccept = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      )
    );
    Alert.alert('Success', 'Connection request accepted!');
  };

  const handleDecline = (requestId: string) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: 'declined' as const } : req
      )
    );
  };

  const renderRequest = ({ item }: { item: ConnectionRequest }) => {
    if (item.status !== 'pending') return null;

    return (
      <Card style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.from.name.charAt(0)}</Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestName}>{item.from.name}</Text>
            <Text style={styles.requestTime}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        </View>

        {item.message && <Text style={styles.message}>{item.message}</Text>}

        <View style={styles.actionsRow}>
          <Button
            onPress={() => handleAccept(item.id)}
            style={styles.acceptButton}
          >
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

  const pendingRequests = requests.filter((req) => req.status === 'pending');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connections</Text>
        <Text style={styles.subtitle}>Manage your connection requests</Text>
      </View>

      <FlatList
        data={pendingRequests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="people-outline"
              size={64}
              color={colors.textMuted}
            />
            <Text style={styles.emptyText}>No pending requests</Text>
            <Text style={styles.emptySubtext}>
              New connection requests will appear here
            </Text>
          </View>
        }
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

