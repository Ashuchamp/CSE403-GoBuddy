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
import { User } from '../types';
import { Card } from './Card';
import { Badge } from './Badge';
import { colors, spacing, typography, borderRadius } from '../theme';

type UserProfileModalProps = {
  user: User | null;
  visible: boolean;
  onClose: () => void;
  currentUserId?: string;
};

export function UserProfileModal({
  user,
  visible,
  onClose,
  currentUserId,
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
            {/* Name and Bio */}
            <View style={styles.nameSection}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </View>

            {/* Activity Tags */}
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

            {/* Contact Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.contactContainer}>
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.contactText}>{user.email}</Text>
                </View>
                {user.phone && (
                  <View style={styles.contactItem}>
                    <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.contactText}>{user.phone}</Text>
                  </View>
                )}
                {user.instagram && (
                  <View style={styles.contactItem}>
                    <Ionicons name="logo-instagram" size={16} color={colors.textSecondary} />
                    <Text style={styles.contactText}>@{user.instagram}</Text>
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
  nameSection: {
    marginBottom: spacing.lg,
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bio: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
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
});
