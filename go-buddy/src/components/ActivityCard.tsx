import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ActivityIntent, User} from '../types';
import {Card} from './Card';
import {Badge} from './Badge';
import {Button} from './Button';
import {colors, spacing, typography, borderRadius} from '../theme';
import {hasCompleteProfile} from '../utils/userValidation';

type ActivityCardProps = {
  intent: ActivityIntent;
  onJoin?: (intentId: string) => void | Promise<void>;
  onPress?: (intent: ActivityIntent) => void;
  showActions?: boolean;
  joinStatus?: 'default' | 'sent' | 'joined';
  currentUser?: User | null;
};

export function ActivityCard({
  intent,
  onJoin,
  onPress,
  showActions = true,
  joinStatus,
  currentUser,
}: ActivityCardProps) {
  const [requestSent, setRequestSent] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const isAlmostFull = intent.currentPeople >= intent.maxPeople * 0.8;
  const isFull = intent.currentPeople >= intent.maxPeople;

  const statusColor = isFull ? colors.error : isAlmostFull ? colors.warning : colors.success;

  // Check if user has complete profile - only show "sent" or "joined" if profile is complete
  const userHasCompleteProfile = currentUser ? hasCompleteProfile(currentUser) : false;

  // Reset local state when joinStatus prop changes or intent changes
  // This ensures local state doesn't persist incorrectly across different activities
  useEffect(() => {
    // Always reset when the intent changes (different activity)
    setRequestSent(false);
    setIsJoining(false);

    // If joinStatus is provided, it's the source of truth - don't use local state
    if (joinStatus !== undefined) {
      setRequestSent(false);
      setIsJoining(false);
    }
  }, [joinStatus, intent.id]);

  // Use joinStatus prop if provided (from parent state), otherwise use local requestSent state
  // CRITICAL: Only show "sent" or "joined" if user has complete profile
  // This prevents showing "Request Sent" when user doesn't have contact info
  const computedStatus: 'default' | 'sent' | 'joined' = (() => {
    // If user doesn't have complete profile, never show "sent" or "joined"
    if (!userHasCompleteProfile) {
      return 'default';
    }

    // If joinStatus is provided, use it (it's the source of truth from backend)
    if (joinStatus !== undefined) {
      return joinStatus;
    }
    // Otherwise, only show "sent" if requestSent is true AND we're not currently joining
    // This prevents showing "sent" during the async operation
    if (requestSent && !isJoining) {
      return 'sent';
    }
    return 'default';
  })();

  const handleJoin = async () => {
    // Prevent action if already in a non-default state or currently joining
    if (computedStatus !== 'default' || isJoining) return;

    // CRITICAL: Set joining state FIRST and reset requestSent to prevent any UI update
    // This ensures the button shows "Joining..." instead of "Request Sent"
    setIsJoining(true);
    setRequestSent(false);

    // Don't set requestSent optimistically - wait for success
    // If joinStatus prop is provided, the parent will update it
    // If not, we only update local state on success
    try {
      await onJoin?.(intent.id);
      // Only set local state if joinStatus prop is not provided
      // (meaning parent isn't managing the state)
      // Check joinStatus again in case it was updated by parent during the async call
      if (joinStatus === undefined) {
        setRequestSent(true);
      }
    } catch (error) {
      // If onJoin throws an error (e.g., profile incomplete), ensure requestSent stays false
      setRequestSent(false);
      // The error is already handled in the parent component (handleJoinActivity)
      // Don't re-throw as we don't want to show another error
    } finally {
      // Always clear joining state when done
      setIsJoining(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        onPress?.(intent);
      }}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{intent.title}</Text>
            <Text style={styles.author}>by {intent.userName}</Text>
          </View>
          <View style={[styles.statusBadge, {backgroundColor: `${statusColor}20`}]}>
            <Ionicons name="people-outline" size={12} color={statusColor} />
            <Text style={[styles.statusText, {color: statusColor}]}>
              {intent.currentPeople}/{intent.maxPeople}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {intent.description}
        </Text>

        {/* Info */}
        <View style={styles.infoContainer}>
          {intent.scheduledTimes.length > 0 && (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <View style={styles.timesWrapper}>
                {intent.scheduledTimes.slice(0, 2).map((time, index) => (
                  <Badge key={index} variant="outline" style={styles.timeBadge}>
                    {time}
                  </Badge>
                ))}
                {intent.scheduledTimes.length > 2 && (
                  <Text style={styles.moreText}>+{intent.scheduledTimes.length - 2} more</Text>
                )}
              </View>
            </View>
          )}

          {intent.campusLocation && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{intent.campusLocation}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              Posted {new Date(intent.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {showActions && (
          <Button
            onPress={handleJoin}
            disabled={
              isFull || computedStatus === 'sent' || computedStatus === 'joined' || isJoining
            }
            variant={isFull ? 'outline' : 'default'}
            fullWidth
            style={{
              ...styles.joinButton,
              ...(computedStatus === 'joined' && styles.joinButtonSent),
              ...(computedStatus === 'sent' && styles.joinButtonRequested),
            }}
          >
            <View style={styles.buttonContent}>
              {isJoining ? (
                <>
                  <ActivityIndicator size="small" color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Joining...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>
                    {isFull
                      ? 'Full'
                      : computedStatus === 'joined'
                        ? 'Joined'
                        : computedStatus === 'sent'
                          ? 'Request Sent'
                          : 'Join Activity'}
                  </Text>
                </>
              )}
            </View>
          </Button>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    gap: 4,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  description: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  infoContainer: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeBadge: {
    marginRight: spacing.xs,
  },
  moreText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  joinButton: {
    marginTop: spacing.sm,
  },
  joinButtonSent: {
    backgroundColor: colors.success,
  },
  joinButtonRequested: {
    backgroundColor: colors.primary,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: spacing.xs,
  },
  buttonText: {
    color: '#fff',
    ...typography.body,
    fontWeight: '600',
  },
});
