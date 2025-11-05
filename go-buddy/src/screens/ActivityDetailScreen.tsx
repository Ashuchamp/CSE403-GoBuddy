import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ActivityIntent, ActivityRequest, User} from '../types';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {Badge} from '../components/Badge';
import {UserProfileModal} from '../components/UserProfileModal';
import {DateTimePicker} from '../components/DateTimePicker';
import {colors, spacing, typography} from '../theme';
import api from '../services/api';

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
  const [editedScheduledTimes, setEditedScheduledTimes] = useState(activity.scheduledTimes);
  const [editedLocation, setEditedLocation] = useState(activity.campusLocation || '');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserShowContact, setSelectedUserShowContact] = useState(false);
  const [approvedCountLocal, setApprovedCountLocal] = useState(0);
  const [maxPeopleLocal, setMaxPeopleLocal] = useState(activity.maxPeople);

  // Update edit fields when activity changes
  useEffect(() => {
    setEditedTitle(activity.title);
    setEditedDescription(activity.description);
    setEditedMaxPeople(activity.maxPeople.toString());
    setEditedScheduledTimes(activity.scheduledTimes);
    setEditedLocation(activity.campusLocation || '');
  }, [activity]);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');

  // Handler to view user profile from request - fetch full user data from backend
  const handleViewPendingUser = async (request: ActivityRequest) => {
    try {
      const fullUser = await api.users.getById(request.userId);
      if (fullUser) {
        setSelectedUser(fullUser);
        setSelectedUserShowContact(false); // Don't show contact for pending requests
      }
    } catch (error) {
      // Fallback to request data if API fails
      const user: User = {
        id: request.userId,
        email: '',
        name: request.userName,
        bio: request.userBio,
        skills: request.userSkills,
        preferredTimes: [],
        activityTags: [],
        campusLocation: '',
      };
      setSelectedUser(user);
      setSelectedUserShowContact(false);
    }
  };

  const handleViewApprovedUser = async (request: ActivityRequest) => {
    try {
      const fullUser = await api.users.getById(request.userId);
      if (fullUser) {
        setSelectedUser(fullUser);
        setSelectedUserShowContact(true); // Show contact info for approved participants
      }
    } catch (error) {
      // Fallback to request data if API fails
      const user: User = {
        id: request.userId,
        email: '',
        name: request.userName,
        bio: request.userBio,
        skills: request.userSkills,
        preferredTimes: [],
        activityTags: [],
        campusLocation: '',
      };
      setSelectedUser(user);
      setSelectedUserShowContact(true);
    }
  };

  // Keep a local, optimistic approved count that updates immediately on approve/decline
  useEffect(() => {
    setApprovedCountLocal(approvedRequests.length);
  }, [approvedRequests.length]);

  useEffect(() => {
    setMaxPeopleLocal(activity.maxPeople);
  }, [activity.maxPeople]);

  const handleSaveEdit = () => {
    // Validate Title - cannot be blank
    if (!editedTitle.trim()) {
      Alert.alert('Error', 'Title is required and cannot be blank');
      return;
    }

    // Validate Maximum People - cannot be blank or invalid
    if (!editedMaxPeople.trim()) {
      Alert.alert('Error', 'Maximum People is required and cannot be blank');
      return;
    }

    const maxPeople = parseInt(editedMaxPeople);
    if (isNaN(maxPeople) || maxPeople < 2) {
      Alert.alert('Error', 'Maximum People must be at least 2');
      return;
    }

    const currentParticipants = Math.max(activity.currentPeople, approvedRequests.length + 1);
    if (maxPeople < currentParticipants) {
      Alert.alert(
        'Error',
        `Maximum people cannot be less than current participants (${currentParticipants})`,
      );
      return;
    }

    onUpdateActivity(activity.id, {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      maxPeople,
      scheduledTimes: editedScheduledTimes,
      campusLocation: editedLocation.trim() || undefined,
    });

    setIsEditing(false);
    Alert.alert('Success', 'Activity updated successfully!');
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark as Complete',
      'Are you sure you want to mark this activity as complete? It will move to the completed section.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Complete',
          onPress: () => {
            // Decline all remaining pending requests
            pendingRequests.forEach((r) => onDeclineRequest(r.id));
            // Send full payload so app can insert/update without losing details
            onUpdateActivity(activity.id, {
              status: 'completed',
              title: activity.title,
              description: activity.description,
              maxPeople: activity.maxPeople,
              scheduledTimes: activity.scheduledTimes,
              campusLocation: activity.campusLocation,
            });
            Alert.alert('Success', 'Activity marked as complete!');
            onClose();
          },
        },
      ],
    );
  };

  const handleCancelActivity = () => {
    Alert.alert(
      'Cancel Activity',
      'Are you sure you want to cancel this activity? It will move to the completed section and all pending requests will be declined.',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Decline all remaining pending requests
            pendingRequests.forEach((r) => onDeclineRequest(r.id));
            // Send full payload so app can insert/update without losing details
            onUpdateActivity(activity.id, {
              status: 'cancelled',
              title: activity.title,
              description: activity.description,
              maxPeople: activity.maxPeople,
              scheduledTimes: activity.scheduledTimes,
              campusLocation: activity.campusLocation,
            });
            Alert.alert('Activity Cancelled', 'The activity has been cancelled.');
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
    const willBeFull = approvedCountLocal + 1 >= maxPeopleLocal;
    if (willBeFull) {
      Alert.alert('Activity is full', 'Increase maximum people by 1 and approve this request?', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Increase & Approve',
          onPress: () => {
            // Send full payload to ensure all activity details are preserved
            onUpdateActivity(activity.id, {
              maxPeople: maxPeopleLocal + 1,
              title: activity.title,
              description: activity.description,
              scheduledTimes: activity.scheduledTimes,
              campusLocation: activity.campusLocation,
              status: activity.status,
            });
            onApproveRequest(request.id);
            setApprovedCountLocal((c) => c + 1);
            setMaxPeopleLocal((m) => m + 1);
          },
        },
      ]);
      return;
    }
    onApproveRequest(request.id);
    setApprovedCountLocal((c) => c + 1);
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

  const currentParticipantsDisplay = Math.max(activity.currentPeople, approvedCountLocal + 1);
  const spotsRemaining = maxPeopleLocal - currentParticipantsDisplay;

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
            {!isEditing && activity.status !== 'completed' && activity.status !== 'cancelled' && (
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
                  containerStyle={styles.textAreaContainer}
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
                <Text style={styles.label}>Scheduled Time(s)</Text>
                <DateTimePicker
                  selectedTimes={editedScheduledTimes}
                  onTimesChange={setEditedScheduledTimes}
                />
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
              <View style={styles.titleRow}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                {(activity.status === 'completed' || activity.status === 'cancelled') && (
                  <Badge
                    variant={activity.status === 'completed' ? 'success' : 'destructive'}
                    style={styles.statusBadge}
                  >
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </Badge>
                )}
              </View>
              <Text style={styles.activityDescription}>{activity.description}</Text>

              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  {currentParticipantsDisplay}/{maxPeopleLocal} people
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

        {/* Pending Requests - Only show for active activities */}
        {activity.status === 'active' && pendingRequests.length > 0 && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              <Badge variant="primary">{pendingRequests.length}</Badge>
            </View>

            {pendingRequests.map((request) => {
              return (
                <View key={request.id} style={styles.requestCard}>
                  <TouchableOpacity
                    style={styles.requestHeader}
                    onPress={() => handleViewPendingUser(request)}
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
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
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
              </View>
            </View>
          </View>

          {approvedRequests.map((request) => {
            return (
              <TouchableOpacity
                key={request.id}
                style={styles.participantCard}
                onPress={() => handleViewApprovedUser(request)}
              >
                <View style={styles.participantInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{request.userName.charAt(0)}</Text>
                  </View>
                  <View style={styles.participantDetails}>
                    <Text style={styles.participantName}>{request.userName}</Text>
                    <Text style={styles.participantBio} numberOfLines={1}>
                      {request.userBio}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        {/* Actions */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Actions</Text>

          {activity.status === 'active' ? (
            <>
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
                onPress={handleCancelActivity}
                fullWidth
                style={styles.actionButton}
              >
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={[styles.actionButtonText, {color: '#fff'}]}>Cancel Activity</Text>
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              onPress={handleDelete}
              fullWidth
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={[styles.actionButtonText, {color: '#fff'}]}>Delete Activity</Text>
            </Button>
          )}
        </Card>
      </ScrollView>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        visible={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        currentUserId={currentUser.id}
        showContactInfo={selectedUserShowContact}
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
  textAreaContainer: {
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  activityTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    marginLeft: spacing.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '700',
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
