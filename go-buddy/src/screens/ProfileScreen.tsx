import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User} from '../types';
import {Card} from '../components/Card';
import {Badge} from '../components/Badge';
import {Button} from '../components/Button';
import {EditProfileModal} from '../components/EditProfileModal';
import {colors, spacing, typography} from '../theme';

type ProfileScreenProps = {
  user: User;
  isCurrentUser?: boolean;
  onUpdateProfile?: (updatedUser: User) => void;
};

export function ProfileScreen({user, isCurrentUser = false, onUpdateProfile}: ProfileScreenProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          {isCurrentUser && (
            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.email}>{user.email}</Text>
            </View>
          )}

          {isCurrentUser && onUpdateProfile && (
            <Button
              onPress={() => setIsEditModalVisible(true)}
              variant="outline"
              style={styles.editButton}
              fullWidth
            >
              <View style={styles.buttonContent}>
                <Ionicons name="create-outline" size={16} color={colors.text} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </View>
            </Button>
          )}
        </Card>

        {/* Bio */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </Card>

        {/* Activity Tags */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Activities & Interests</Text>
          <View style={styles.tagsContainer}>
            {user.activityTags.map((tag, index) => (
              <Badge key={index} variant="secondary" style={styles.tag}>
                {tag}
              </Badge>
            ))}
          </View>
        </Card>

        {/* Skills */}
        {user.skills.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Skills & Experience</Text>
            <View style={styles.tagsContainer}>
              {user.skills.map((skill, index) => (
                <Badge key={index} variant="outline" style={styles.tag}>
                  {skill}
                </Badge>
              ))}
            </View>
          </Card>
        )}

        {/* Preferred Times */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Times</Text>
          <View style={styles.timesList}>
            {user.preferredTimes.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Campus Location */}
        {user.campusLocation && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Campus Location</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.locationText}>{user.campusLocation}</Text>
            </View>
          </Card>
        )}

        {/* Contact Info (if available) */}
        {(user.phone || user.instagram || user.contactEmail) && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            {user.contactEmail && (
              <View style={styles.contactRow}>
                <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{user.contactEmail}</Text>
              </View>
            )}
            {user.phone && (
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{user.phone}</Text>
              </View>
            )}
            {user.instagram && (
              <View style={styles.contactRow}>
                <Ionicons name="logo-instagram" size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{user.instagram}</Text>
              </View>
            )}
          </Card>
        )}
      </View>

      {/* Edit Profile Modal */}
      {isCurrentUser && onUpdateProfile && (
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          user={user}
          onSave={onUpdateProfile}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  headerCard: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h1,
    color: '#fff',
  },
  name: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
  },
  editButton: {
    marginTop: spacing.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  editButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  bio: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  timesList: {
    gap: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  contactText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
