import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ViewStyle,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ActivityIntent, ActivityRequest} from '../types';
import {Card} from './Card';
import {Badge} from './Badge';
import {Button} from './Button';
import {colors, spacing, typography, borderRadius} from '../theme';

type ActivityDetailModalProps = {
  activity: ActivityIntent | null;
  visible: boolean;
  onClose: () => void;
  currentUserId?: string;
  onJoinActivity?: (activityId: string) => void | Promise<void>;
  activityRequests?: ActivityRequest[];
};

export function ActivityDetailModal({
  activity,
  visible,
  onClose,
  currentUserId,
  onJoinActivity,
  activityRequests = [],
}: ActivityDetailModalProps) {
  if (!activity) return null;

  const isAlmostFull = activity.currentPeople >= activity.maxPeople * 0.8;
  const isFull = activity.currentPeople >= activity.maxPeople;
  const isOwnActivity = currentUserId === activity.userId;

  // Check if user has already requested to join
  const userRequest = activityRequests.find(
    (r) => r.activityId === activity.id && r.userId === currentUserId,
  );
  const requestStatus = userRequest?.status; // 'pending' | 'approved' | 'declined' | undefined

  const statusColor = isFull ? colors.error : isAlmostFull ? colors.warning : colors.success;

  const handleJoin = async () => {
    if (!onJoinActivity) return;
    if (isOwnActivity) {
      Alert.alert('Cannot Join', 'You cannot join your own activity.');
      return;
    }
    if (isFull) {
      Alert.alert('Activity Full', 'This activity is already full.');
      return;
    }
    if (requestStatus === 'approved') {
      Alert.alert('Already Joined', 'You have already joined this activity.');
      return;
    }
    if (requestStatus === 'pending') {
      Alert.alert('Request Pending', 'Your request to join is already pending.');
      return;
    }
    try {
      await onJoinActivity(activity.id);
      // Optionally close the modal after joining
      // onClose();
    } catch (error) {
      // Error is already handled in handleJoinActivity
    }
  };

  const handleLocationPress = async () => {
    const locationName = activity.locationName || activity.campusLocation;

    if (!locationName && !activity.latitude && !activity.longitude) {
      Alert.alert('No Location', 'This activity does not have location information.');
      return;
    }

    try {
      let url: string;

      // If we have coordinates, use them for more accurate navigation
      if (activity.latitude && activity.longitude) {
        // Use Google Maps with coordinates
        url = `https://www.google.com/maps/search/?api=1&query=${activity.latitude},${activity.longitude}`;
      } else {
        // Fallback to location name search
        const encodedLocation = encodeURIComponent(locationName!);
        url = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
      }

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open Google Maps. Please install Google Maps app.');
      }
    } catch (error) {
      console.error('Error opening Google Maps:', error);
      Alert.alert('Error', 'Failed to open Google Maps. Please try again.');
    }
  };

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
            <View style={[styles.statusBadge, {backgroundColor: `${statusColor}20`}]}>
              <Ionicons name="people-outline" size={16} color={statusColor} />
              <Text style={[styles.statusText, {color: statusColor}]}>
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
            {(activity.campusLocation || activity.locationName) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <TouchableOpacity
                  onPress={handleLocationPress}
                  style={styles.locationContainer}
                  activeOpacity={0.7}
                >
                  <Ionicons name="location-outline" size={16} color={colors.primary} />
                  <Text style={styles.locationText}>
                    {activity.locationName || activity.campusLocation}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={colors.textSecondary}
                    style={styles.locationArrow}
                  />
                </TouchableOpacity>
                <Text style={styles.locationHint}>Tap to open in Google Maps</Text>
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

          {/* Join Button */}
          {onJoinActivity && (
            <View style={styles.joinSection}>
              <Button
                onPress={handleJoin}
                disabled={
                  isOwnActivity ||
                  isFull ||
                  requestStatus === 'approved' ||
                  requestStatus === 'pending'
                }
                variant={isFull ? 'outline' : 'default'}
                fullWidth
                style={
                  StyleSheet.flatten([
                    styles.joinButton,
                    requestStatus === 'approved' && styles.joinButtonJoined,
                    requestStatus === 'pending' && styles.joinButtonPending,
                  ]) as ViewStyle
                }
              >
                <View style={styles.buttonContent}>
                  <Ionicons
                    name={
                      isOwnActivity
                        ? 'person-outline'
                        : requestStatus === 'approved'
                          ? 'checkmark-circle'
                          : requestStatus === 'pending'
                            ? 'time-outline'
                            : isFull
                              ? 'close-circle-outline'
                              : 'checkmark-circle-outline'
                    }
                    size={18}
                    color={
                      requestStatus === 'approved'
                        ? '#fff'
                        : requestStatus === 'pending'
                          ? '#fff'
                          : isOwnActivity || isFull
                            ? colors.textSecondary
                            : '#fff'
                    }
                    style={styles.buttonIcon}
                  />
                  <Text
                    style={[
                      styles.buttonText,
                      (isOwnActivity ||
                        (isFull && requestStatus !== 'approved' && requestStatus !== 'pending')) &&
                        styles.buttonTextDisabled,
                    ]}
                  >
                    {isOwnActivity
                      ? 'Your Activity'
                      : requestStatus === 'approved'
                        ? 'Joined'
                        : requestStatus === 'pending'
                          ? 'Request Sent'
                          : isFull
                            ? 'Full'
                            : 'Join Activity'}
                  </Text>
                </View>
              </Button>
            </View>
          )}
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
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
  },
  locationText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  locationArrow: {
    marginLeft: 'auto',
  },
  locationHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginLeft: spacing.sm + 16 + spacing.sm, // Align with location icon
    fontStyle: 'italic',
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
  joinSection: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  joinButton: {
    marginTop: spacing.sm,
  },
  joinButtonJoined: {
    backgroundColor: colors.success,
  },
  joinButtonPending: {
    backgroundColor: colors.warning,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  buttonIcon: {
    marginRight: 0,
  },
  buttonText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: colors.textSecondary,
  },
});
