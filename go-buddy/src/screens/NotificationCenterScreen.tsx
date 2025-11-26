import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {colors, typography, spacing, borderRadius} from '../theme';
import {Notification} from '../types';
import api from '../services/api';

type NotificationCenterScreenProps = {
  currentUserId: string;
};

// Module-level storage for mock notification read state (persists across component remounts)
const mockReadState = new Set<string>();

// Mock notifications for development/testing
const getMockNotifications = (): Notification[] => {
  const now = new Date();
  return [
    {
      id: 'mock-1',
      userId: 'current-user',
      message: 'John Doe wants to join your activity "Saturday Hike"',
      isRead: false,
      createdAt: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
    },
    {
      id: 'mock-2',
      userId: 'current-user',
      message: 'Sarah Chen wants to join your activity "Basketball at IMA"',
      isRead: false,
      createdAt: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
    },
    {
      id: 'mock-3',
      userId: 'current-user',
      message: 'Mike Johnson wants to join your activity "Study Group for CSE 403"',
      isRead: true,
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(), // 1 day ago
    },
    {
      id: 'mock-4',
      userId: 'current-user',
      message: 'Emily Zhang wants to join your activity "Coffee Chat at Suzzallo"',
      isRead: true,
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(), // 2 days ago
    },
    {
      id: 'mock-5',
      userId: 'current-user',
      message: 'Alex Kim wants to join your activity "Weekend Volleyball"',
      isRead: false,
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(), // 3 days ago
    },
  ];
};

export function NotificationCenterScreen({currentUserId}: NotificationCenterScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.notifications.getAll(currentUserId);
      // Use mock data if API returns empty (for development)
      if (data.length === 0) {
        const mockNotifications = getMockNotifications();
        // Restore read state for mock notifications from module-level storage
        const notificationsWithReadState = mockNotifications.map((n) => ({
          ...n,
          isRead: mockReadState.has(n.id) || n.isRead,
        }));
        setNotifications(notificationsWithReadState);
      } else {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Use mock data on error (for development)
      const mockNotifications = getMockNotifications();
      // Restore read state for mock notifications from module-level storage
      const notificationsWithReadState = mockNotifications.map((n) => ({
        ...n,
        isRead: mockReadState.has(n.id) || n.isRead,
      }));
      setNotifications(notificationsWithReadState);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUserId]);

  // Only fetch on initial mount
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When screen is focused, only update if we don't have notifications yet
  // This prevents resetting read state when navigating back
  useFocusEffect(
    useCallback(() => {
      // Only fetch if we have no notifications (initial load)
      if (notifications.length === 0 && !loading) {
        fetchNotifications();
      }
    }, [notifications.length, loading, fetchNotifications]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    // For mock notifications, update locally and persist read state in module-level storage
    if (notificationId.startsWith('mock-')) {
      mockReadState.add(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? {...n, isRead: true} : n)),
      );
      return;
    }

    // For real notifications, call the API
    try {
      await api.notifications.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? {...n, isRead: true} : n)),
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Still update UI optimistically even if API call fails
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? {...n, isRead: true} : n)),
      );
    }
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({item}: {item: Notification}) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
      onPress={() => handleMarkAsRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={item.isRead ? colors.textMuted : colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.message, !item.isRead && styles.unreadMessage]}>{item.message}</Text>
          <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            You&apos;ll see notifications here when someone wants to join your activities
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.md,
  },
  notificationItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: '600',
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
