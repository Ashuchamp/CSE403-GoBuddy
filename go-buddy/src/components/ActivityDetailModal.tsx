import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIntent } from '../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { colors, spacing, typography, borderRadius } from '../theme';

type ActivityDetailModalProps = {
  activity: ActivityIntent | null;
  visible: boolean;
  onClose: () => void;
  currentUserId?: string;
};

export function ActivityDetailModal({
  activity,
  visible,
  onClose,
  currentUserId,
}: ActivityDetailModalProps) {
  console.log('ActivityDetailModal: visible=', visible, 'activity=', activity?.title);
  if (!activity) return null;

  const isAlmostFull = activity.currentPeople >= activity.maxPeople * 0.8;
  const isFull = activity.currentPeople >= activity.maxPeople;
  const isOwnActivity = currentUserId === activity.userId;

  const statusColor = isFull
    ? colors.error
    : isAlmostFull
    ? colors.warning
    : colors.success;


  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Activity Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Activity Card */}
          <Card style={styles.activityCard}>
            {/* Title and Author */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{activity.title}</Text>
              <Text style={styles.author}>by {activity.userName}</Text>
            </View>

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
              <Ionicons name="people-outline" size={16} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {activity.currentPeople}/{activity.maxPeople} people
              </Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>
                {activity.description || 'No description provided'}
              </Text>
            </View>

            {/* Scheduled Times */}
            {activity.scheduledTimes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Scheduled Times</Text>
                <View style={styles.timesContainer}>
                  {activity.scheduledTimes.map((time, index) => (
                    <Badge key={index} variant="secondary" style={styles.timeBadge}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.timeText}>{time}</Text>
                    </Badge>
                  ))}
                </View>
              </View>
            )}

            {/* Location */}
            {activity.campusLocation && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.locationText}>{activity.campusLocation}</Text>
                </View>
              </View>
            )}

            {/* Activity Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity Info</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Max People</Text>
                  <Text style={styles.infoValue}>{activity.maxPeople}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Created</Text>
                  <Text style={styles.infoValue}>
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  activityCard: {
    marginBottom: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  statusText: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationText: {
    ...typography.body,
    color: colors.text,
  },
  infoGrid: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
});
