import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ActivityIntent, ActivityRequest, User} from '../types';
import {mockUsers} from '../data/mockUsers';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {Badge} from '../components/Badge';
import {UserProfileModal} from '../components/UserProfileModal';
import {colors, spacing, typography, borderRadius} from '../theme';

type ActivityDetailScreenProps = {
  activity: ActivityIntent;
  requests: ActivityRequest[];
  currentUser: User;
  onClose: () => void;
  onUpdateActivity: (activityId: string, updates: Partial<ActivityIntent>) => void;
  onDeleteActivity: (activityId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
};

export function ActivityDetailScreen({
  activity,
  requests,
  currentUser,
  onClose,
  onUpdateActivity,
  onDeleteActivity,
  onApproveRequest,
  onDeclineRequest,
}: ActivityDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(activity.title);
  const [editedDescription, setEditedDescription] = useState(activity.description);
  const [editedMaxPeople, setEditedMaxPeople] = useState(activity.maxPeople.toString());
  const [editedScheduledTime, setEditedScheduledTime] = useState(
    activity.scheduledTimes.join(', '),
  );
  const [editedLocation, setEditedLocation] = useState(activity.campusLocation || '');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Update edit fields when activity changes
  useEffect(() => {
    setEditedTitle(activity.title);
    setEditedDescription(activity.description);
    setEditedMaxPeople(activity.maxPeople.toString());
    setEditedScheduledTime(activity.scheduledTimes.join(', '));
    setEditedLocation(activity.campusLocation || '');
  }, [activity]);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');

  const handleSaveEdit = () => {
    if (!editedTitle.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    const maxPeople = parseInt(editedMaxPeople);
    if (maxPeople < approvedRequests.length + 1) {
      Alert.alert(
        'Error',
        `Maximum people cannot be less than current participants (${approvedRequests.length + 1})`,
      );
      return;
    }

    onUpdateActivity(activity.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      maxPeople,
      scheduledTimes: editedScheduledTime.split(',').map((t) => t.trim()),
      campusLocation: editedLocation.trim() || undefined,
    });

    setIsEditing(false);
    Alert.alert('Success', 'Activity updated successfully!');
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark as Complete',
      'Are you sure you want to mark this activity as complete? It will move to inactive.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Complete',
          onPress: () => {
            onUpdateActivity(activity.id, {status: 'completed'});
            Alert.alert('Success', 'Activity marked as complete!');
            onClose();
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteActivity(activity.id);
            Alert.alert('Success', 'Activity deleted!');
            onClose();
          },
        },
      ],
    );
  };

  const handleApprove = (request: ActivityRequest) => {
    if (approvedRequests.length + 1 >= activity.maxPeople) {
      Alert.alert('Notice', 'This activity will be full after approving this request.');
    }
    onApproveRequest(request.id);
  };

  const handleDecline = (request: ActivityRequest) => {
    Alert.alert('Decline Request', `Decline request from ${request.userName}?`, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Decline',
        style: 'destructive',
        onPress: () => onDeclineRequest(request.id),
      },
    ]);
  };

  const spotsRemaining = activity.maxPeople - (approvedRequests.length + 1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Activity</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Activity Info Card */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Activity Details</Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View>
              <View style={styles.formSection}>
                <Text style={styles.label}>Title *</Text>
                <Input value={editedTitle} onChangeText={setEditedTitle} />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Description</Text>
                <Input
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  multiline
                  numberOfLines={3}
                  style={styles.textArea}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Maximum People *</Text>
                <Input
                  value={editedMaxPeople}
                  onChangeText={setEditedMaxPeople}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Scheduled Times *</Text>
                <Input value={editedScheduledTime} onChangeText={setEditedScheduledTime} />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Location</Text>
                <Input value={editedLocation} onChangeText={setEditedLocation} />
              </View>

              <View style={styles.buttonRow}>
                <Button
                  variant="outline"
                  onPress={() => setIsEditing(false)}
                  style={styles.halfButton}
                >
                  Cancel
                </Button>
                <Button onPress={handleSaveEdit} style={styles.halfButton}>
                  Save
                </Button>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  {approvedRequests.length + 1}/{activity.maxPeople} people
                  {spotsRemaining > 0 && ` • ${spotsRemaining} spots left`}
                </Text>
              </View>

              {activity.scheduledTimes.length > 0 && (
                <View style={styles.infoRow}>
                  <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                  <View style={styles.timesContainer}>
                    {activity.scheduledTimes.map((time, index) => (
                      <Badge key={index} variant="outline" style={styles.timeBadge}>
                        {time}
                      </Badge>
                    ))}
                  </View>
                </View>
              )}

              {activity.campusLocation && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{activity.campusLocation}</Text>
                </View>
              )}
            </View>
          )}
        </Card>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              <Badge variant="primary">{pendingRequests.length}</Badge>
            </View>

            {pendingRequests.map((request) => {
              const userData = mockUsers.find(user => user.id === request.userId);
              
              return (
                <View key={request.id} style={styles.requestCard}>
                  <TouchableOpacity 
                    style={styles.requestHeader}
                    onPress={() => setSelectedUser(userData || null)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.requestInfo}>
                      <Text style={styles.requestName}>{request.userName}</Text>
                      <Text style={styles.requestBio} numberOfLines={2}>
                        {request.userBio}
                      </Text>
                      {request.userSkills.length > 0 && (
                        <View style={styles.skillsContainer}>
                          {request.userSkills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" style={styles.skillBadge}>
                              {skill}
                            </Badge>
                          ))}
                        </View>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <View style={styles.requestActions}>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => handleDecline(request)}
                      style={styles.requestButton}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onPress={() => handleApprove(request)}
                      style={styles.requestButton}
                    >
                      Approve
                    </Button>
                  </View>
                </View>
              );
            })}
          </Card>
        )}

        {/* Approved Participants */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <Badge variant="success">{approvedRequests.length + 1}</Badge>
          </View>

          <View style={styles.participantCard}>
            <View style={styles.participantInfo}>
              <Ionicons name="person-circle" size={40} color={colors.primary} />
              <View style={styles.participantDetails}>
                <Text style={styles.participantName}>{currentUser.name} (You)</Text>
                <Badge variant="primary" style={styles.organizerBadge}>
                  Organizer
                </Badge>
                {/* Show organizer's contact information */}
                {(currentUser.phone || currentUser.instagram) && (
                  <View style={styles.contactContainer}>
                    <Text style={styles.contactLabel}>Your Contact Information</Text>
                    <View style={styles.contactWrapper}>
                      {currentUser.phone && (
                        <View style={styles.contactItem}>
                          <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.contactText}>{currentUser.phone}</Text>
                        </View>
                      )}
                      {currentUser.instagram && (
                        <View style={styles.contactItem}>
                          <Ionicons name="logo-instagram" size={14} color={colors.textSecondary} />
                          <Text style={styles.contactText}>{currentUser.instagram}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          {approvedRequests.map((request) => {
            // Get user data for contact information
            const userData = mockUsers.find(user => user.id === request.userId);
            const hasContactInfo = userData && (userData.phone || userData.instagram);
            
            return (
              <View key={request.id} style={styles.participantCard}>
                <View style={styles.participantInfo}>
                  <Ionicons name="person-circle" size={40} color={colors.textSecondary} />
                  <View style={styles.participantDetails}>
                    <Text style={styles.participantName}>{request.userName}</Text>
                    <Text style={styles.participantBio} numberOfLines={1}>
                      {request.userBio}
                    </Text>
                    {/* Contact Information - Only show for approved participants */}
                    {hasContactInfo && (
                      <View style={styles.contactContainer}>
                        <Text style={styles.contactLabel}>Contact Information</Text>
                        <View style={styles.contactWrapper}>
                          {userData?.phone && (
                            <View style={styles.contactItem}>
                              <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                              <Text style={styles.contactText}>{userData.phone}</Text>
                            </View>
                          )}
                          {userData?.instagram && (
                            <View style={styles.contactItem}>
                              <Ionicons name="logo-instagram" size={14} color={colors.textSecondary} />
                              <Text style={styles.contactText}>{userData.instagram}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Actions */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Actions</Text>

          <Button
            variant="outline"
            onPress={handleMarkComplete}
            fullWidth
            style={styles.actionButton}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.text} />
            <Text style={styles.actionButtonText}>Mark as Complete</Text>
          </Button>

          <Button
            variant="destructive"
            onPress={handleDelete}
            fullWidth
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={[styles.actionButtonText, {color: '#fff'}]}>Delete Activity</Text>
          </Button>
        </Card>
      </ScrollView>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        visible={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        currentUserId={currentUser.id}
        showContactInfo={false} // Contact info hidden for pending requests
      />
    </View>
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
    paddingVertical: spacing.md,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
  },
  formSection: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
  activityTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  activityDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: spacing.sm,
    gap: spacing.xs,
  },
  timeBadge: {
    marginBottom: spacing.xs,
  },
  requestCard: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  requestHeader: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  requestBio: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skillBadge: {
    marginBottom: spacing.xs,
  },
  requestActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  requestButton: {
    flex: 1,
  },
  participantCard: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  participantName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  participantBio: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  organizerBadge: {
    alignSelf: 'flex-start',
  },
  actionButton: {
    marginBottom: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButtonText: {
    marginLeft: spacing.xs,
  },
  contactContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contactLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  contactWrapper: {
    gap: spacing.xs,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  contactText: {
    ...typography.bodySmall,
    color: colors.text,
  },
});
