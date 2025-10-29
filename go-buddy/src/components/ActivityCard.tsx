import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ActivityIntent} from '../types';
import {Card} from './Card';
import {Badge} from './Badge';
import {Button} from './Button';
import {colors, spacing, typography, borderRadius} from '../theme';

type ActivityCardProps = {
  intent: ActivityIntent;
  onJoin?: (intentId: string) => void;
  onPress?: (intent: ActivityIntent) => void;
  showActions?: boolean;
};

export function ActivityCard({intent, onJoin, onPress, showActions = true}: ActivityCardProps) {
  const [requestSent, setRequestSent] = useState(false);
  const isAlmostFull = intent.currentPeople >= intent.maxPeople * 0.8;
  const isFull = intent.currentPeople >= intent.maxPeople;

  const statusColor = isFull ? colors.error : isAlmostFull ? colors.warning : colors.success;

  const handleJoin = () => {
    setRequestSent(true);
    onJoin?.(intent.id);
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
            disabled={isFull || requestSent}
            variant={isFull ? 'outline' : 'default'}
            fullWidth
            style={{
              ...styles.joinButton,
              ...(requestSent && styles.joinButtonSent),
            }}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {isFull ? 'Full' : requestSent ? 'Request Sent' : 'Join Activity'}
              </Text>
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
