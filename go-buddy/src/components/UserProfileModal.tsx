import React from 'react';
import {View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User} from '../types';
import {Card} from './Card';
import {Badge} from './Badge';
import {colors, spacing, typography, borderRadius} from '../theme';

type UserProfileModalProps = {
  user: User | null;
  visible: boolean;
  onClose: () => void;
  currentUserId?: string;
  showContactInfo?: boolean;
};

export function UserProfileModal({
  user,
  visible,
  onClose,
  currentUserId,
  showContactInfo = false,
}: UserProfileModalProps) {
  if (!user) return null;

  const isOwnProfile = currentUserId === user.id;

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
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            {/* Title and Bio */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{user.name}</Text>
              {showContactInfo && (
                <Text style={styles.author}>{user.email}</Text>
              )}
            </View>

            {/* Status Badge - Show user type */}
            <View style={[styles.statusBadge, { backgroundColor: `${colors.primary}20` }]}>
              <Ionicons name="person-outline" size={16} color={colors.primary} />
              <Text style={[styles.statusText, { color: colors.primary }]}>
                {isOwnProfile ? 'Your Profile' : 'Student Profile'}
              </Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>
                {user.bio || 'No bio provided'}
              </Text>
            </View>

            {/* Activity Interests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity Interests</Text>
              <View style={styles.tagsContainer}>
                {user.activityTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" style={styles.tag}>
                    {tag}
                  </Badge>
                ))}
              </View>
            </View>

            {/* Preferred Times */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferred Times</Text>
              <View style={styles.timesContainer}>
                {user.preferredTimes.map((time, index) => (
                  <Badge key={index} variant="outline" style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.timeText}>{time}</Text>
                  </Badge>
                ))}
              </View>
            </View>

            {/* Campus Location */}
            {user.campusLocation && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Campus Location</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.locationText}>{user.campusLocation}</Text>
                </View>
              </View>
            )}

            {/* Skills & Experience */}
            {user.skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills & Experience</Text>
                <View style={styles.skillsContainer}>
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" style={styles.skill}>
                      {skill}
                    </Badge>
                  ))}
                </View>
              </View>
            )}

            {/* Contact Information - Only show if showContactInfo is true or it's own profile */}
            {(showContactInfo || isOwnProfile) && (user.phone || user.instagram) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.contactContainer}>
                  {user.phone && (
                    <View style={styles.contactItem}>
                      <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.contactText}>{user.phone}</Text>
                    </View>
                  )}
                  {user.instagram && (
                    <View style={styles.contactItem}>
                      <Ionicons name="logo-instagram" size={16} color={colors.textSecondary} />
                      <Text style={styles.contactText}>{user.instagram}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Profile Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Info</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="school-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoLabel}>Student</Text>
                  <Text style={styles.infoValue}>UW Student</Text>
                </View>
                {showContactInfo && (
                  <View style={styles.infoItem}>
                    <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user.email}</Text>
                  </View>
                )}
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
  profileCard: {
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
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    marginBottom: spacing.xs,
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
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skill: {
    marginBottom: spacing.xs,
  },
  contactContainer: {
    gap: spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactText: {
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
