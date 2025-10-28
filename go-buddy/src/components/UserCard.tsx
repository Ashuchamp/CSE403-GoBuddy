import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User} from '../types';
import {Card} from './Card';
import {Badge} from './Badge';
import {Button} from './Button';
import {colors, spacing, typography} from '../theme';

type UserCardProps = {
  user: User;
  currentUser: User;
  onPress?: () => void;
  onConnectRequest?: () => void;
};

export function UserCard({
  user,
  currentUser: _currentUser,
  onPress,
  onConnectRequest,
}: UserCardProps) {
  const [requestSent, setRequestSent] = useState(false);

  const handleConnect = () => {
    setRequestSent(true);
    onConnectRequest?.();
  };

  const buttonStyle: ViewStyle = requestSent
    ? {
        ...styles.connectButton,
        backgroundColor: colors.success,
      }
    : styles.connectButton;

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.bio} numberOfLines={2}>
              {user.bio}
            </Text>
          </View>
        </View>

        {/* Activity Tags */}
        <View style={styles.tagsContainer}>
          {user.activityTags.slice(0, 4).map((tag, index) => (
            <Badge key={index} variant="secondary" style={styles.tag}>
              {tag}
            </Badge>
          ))}
          {user.activityTags.length > 4 && (
            <Badge variant="outline" style={styles.tag}>
              +{user.activityTags.length - 4} more
            </Badge>
          )}
        </View>

        {/* Preferred Times & Location */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{user.preferredTimes[0]}</Text>
          </View>
          {user.campusLocation && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user.campusLocation}</Text>
            </View>
          )}
        </View>

        {/* Skills */}
        {user.skills.length > 0 && (
          <View style={styles.skillsContainer}>
            <Text style={styles.skillsLabel}>Skills & Experience</Text>
            <View style={styles.skillsWrapper}>
              {user.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" style={styles.skill}>
                  {skill}
                </Badge>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Action Button */}
      <Button onPress={handleConnect} disabled={requestSent} style={buttonStyle} fullWidth>
        <View style={styles.buttonContent}>
          <Ionicons name="person-add-outline" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {requestSent ? 'Request Sent' : 'Request to Connect'}
          </Text>
        </View>
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    marginBottom: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bio: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  tag: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoContainer: {
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  skillsContainer: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
  },
  skillsLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skill: {
    marginRight: spacing.xs,
  },
  connectButton: {
    marginTop: spacing.sm,
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
