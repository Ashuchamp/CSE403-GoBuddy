import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User, ActivityIntent, ActivityRequest} from '../types';
import {mockUsers} from '../data/mockUsers';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {Badge} from '../components/Badge';
// import {ActivityCard} from '../components/ActivityCard'; // Unused for now
import {ActivityDetailScreen} from './ActivityDetailScreen';
import {ActivityDetailModal} from '../components/ActivityDetailModal';
import {DateTimePicker} from '../components/DateTimePicker';
import {colors, spacing, typography, borderRadius} from '../theme';
import {mockActivityIntents} from '../data/mockActivityIntents';
import {mockActivityRequests} from '../data/mockActivityRequests';

type MyActivitiesScreenProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  activityRequests: ActivityRequest[];
  onCreateActivity: (
    activity: Omit<ActivityIntent, 'id' | 'userId' | 'userName' | 'createdAt'>,
  ) => void;
  onUpdateActivity: (activityId: string, updates: Partial<ActivityIntent>) => void;
  onDeleteActivity: (activityId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
};

type ViewMode = 'create' | 'organizing' | 'participating';
type ParticipatingFilter = 'pending' | 'approved' | 'declined';

export function MyActivitiesScreen({
  currentUser,
  activityIntents,
  activityRequests,
  onCreateActivity,
  onUpdateActivity,
  onDeleteActivity,
  onApproveRequest,
  onDeclineRequest,
}: MyActivitiesScreenProps) {
  // Fallback demo data when props are empty
  const demoOrganizingIntents: ActivityIntent[] = [
    {
      id: 'demo-activity-1',
      userId: currentUser.id,
      userName: currentUser.name,
      title: 'Stats Study Group',
      description: 'Work through problem sets together. Bring notes and questions!',
      maxPeople: 5,
      currentPeople: 2,
      scheduledTimes: ['Tue 6-8pm'],
      createdAt: new Date().toISOString(),
      campusLocation: 'Odegaard Library',
      status: 'active',
    },
    {
      id: 'demo-activity-2',
      userId: currentUser.id,
      userName: currentUser.name,
      title: 'Morning Run Club',
      description: 'Easy 5K around campus. All paces welcome.',
      maxPeople: 2,
      currentPeople: 1,
      scheduledTimes: ['Sat 8-9am'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      campusLocation: 'Husky Stadium',
      status: 'active',
    },
  ];

  const demoCompletedIntents: ActivityIntent[] = [
    {
      id: 'demo-activity-3',
      userId: currentUser.id,
      userName: currentUser.name,
      title: 'CSE 142 Practice Session',
      description: 'Past session focused on arrays and loops. Marked as completed.',
      maxPeople: 6,
      currentPeople: 5,
      scheduledTimes: ['Last Mon 5-6pm'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      campusLocation: 'Allen Library',
      status: 'completed',
    },
    {
      id: 'demo-activity-4',
      userId: currentUser.id,
      userName: currentUser.name,
      title: 'Evening Badminton',
      description: 'Cancelled due to venue unavailability.',
      maxPeople: 4,
      currentPeople: 0,
      scheduledTimes: ['Last Fri 7-8pm'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      campusLocation: 'IMA Courts',
      status: 'cancelled',
    },
  ];

  // Demo approved requests for organizing activities
  const demoOrganizingRequests: ActivityRequest[] = [
    // Participant for Stats Study Group (1 approved + 1 organizer = 2 current)
    {
      id: 'demo-organizing-req-1',
      activityId: 'demo-activity-1',
      userId: '4',
      userName: 'Emily Park',
      userBio:
        'Psychology major interested in research and coffee chats. Looking for study buddies for stats!',
      userSkills: ['SPSS', 'Research Methods', 'Data Analysis'],
      status: 'approved',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];

  // Demo approved requests for completed activities
  const demoCompletedRequests: ActivityRequest[] = [
    // Participants for CSE 142 Practice Session (4 approved + 1 organizer = 5 total)
    {
      id: 'demo-completed-req-1',
      activityId: 'demo-activity-3',
      userId: '3',
      userName: 'Mike Chen',
      userBio: 'CSE major who loves basketball and coding. Always down to work on side projects!',
      userSkills: ['Java', 'C++', 'Machine Learning', 'iOS Development'],
      status: 'approved',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    },
    {
      id: 'demo-completed-req-2',
      activityId: 'demo-activity-3',
      userId: '4',
      userName: 'Emily Park',
      userBio:
        'Psychology major interested in research and coffee chats. Looking for study buddies for stats!',
      userSkills: ['SPSS', 'Research Methods', 'Data Analysis'],
      status: 'approved',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 78).toISOString(),
    },
    {
      id: 'demo-completed-req-3',
      activityId: 'demo-activity-3',
      userId: '11',
      userName: 'Chris Davis',
      userBio:
        'Math major who loves problem-solving and rock climbing. Looking for study partners!',
      userSkills: ['Calculus', 'Linear Algebra', 'Proof Writing'],
      status: 'approved',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 76).toISOString(),
    },
    {
      id: 'demo-completed-req-4',
      activityId: 'demo-activity-3',
      userId: '7',
      userName: 'David Nguyen',
      userBio:
        'Pre-med studying hard! Looking for study partners for organic chem and fellow gym-goers.',
      userSkills: ['Chemistry', 'Biology', 'MCAT Prep'],
      status: 'approved',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 74).toISOString(),
    },
  ];

  // Start with app-provided intents if any; otherwise seed with general mocks
  const baseIntents: ActivityIntent[] =
    activityIntents && activityIntents.length > 0 ? activityIntents : [...mockActivityIntents];

  // Always include demo organizing and demo completed items, but dedupe by id
  const idSet = new Set(baseIntents.map((a) => a.id));
  const mergedWithDemos: ActivityIntent[] = [...baseIntents];
  for (const demo of demoOrganizingIntents) {
    if (!idSet.has(demo.id)) {
      idSet.add(demo.id);
      mergedWithDemos.push(demo);
    }
  }
  for (const demo of demoCompletedIntents) {
    if (!idSet.has(demo.id)) {
      idSet.add(demo.id);
      mergedWithDemos.push(demo);
    }
  }

  const effectiveActivityIntents: ActivityIntent[] = mergedWithDemos;

  const baseRequests: ActivityRequest[] =
    activityRequests && activityRequests.length > 0
      ? activityRequests
      : mockActivityRequests.map((r) =>
          r.userId === '1'
            ? {
                ...r,
                userId: currentUser.id,
                userName: currentUser.name,
              }
            : r,
        );

  const hasMyParticipating = baseRequests.some((r) => r.userId === currentUser.id);
  const seedParticipating: ActivityRequest[] = hasMyParticipating
    ? []
    : [
        {
          id: 'demo-req-pending',
          activityId: 'intent-1',
          userId: currentUser.id,
          userName: currentUser.name,
          userBio:
            "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
          userSkills: ['Python', 'React', 'Data Structures'],
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'demo-req-approved',
          activityId: 'intent-2',
          userId: currentUser.id,
          userName: currentUser.name,
          userBio:
            "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
          userSkills: ['Python', 'React', 'Data Structures'],
          status: 'approved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
        {
          id: 'demo-req-declined',
          activityId: 'intent-3',
          userId: currentUser.id,
          userName: currentUser.name,
          userBio:
            "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
          userSkills: ['Python', 'React', 'Data Structures'],
          status: 'declined',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
      ];

  const effectiveActivityRequests: ActivityRequest[] = [
    ...baseRequests,
    ...seedParticipating,
    ...demoOrganizingRequests,
    ...demoCompletedRequests,
  ];
  const [viewMode, setViewMode] = useState<ViewMode>('organizing');
  const [participatingFilter, setParticipatingFilter] = useState<ParticipatingFilter>('pending');
  const [selectedActivity, setSelectedActivity] = useState<ActivityIntent | null>(null);
  const [selectedParticipatingActivity, setSelectedParticipatingActivity] =
    useState<ActivityIntent | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Form state for creating activities
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxPeople, setMaxPeople] = useState('');
  const [scheduledTimes, setScheduledTimes] = useState<string[]>([]);
  const [location, setLocation] = useState('');

  // Get activities I'm organizing
  const myActivities = effectiveActivityIntents.filter(
    (intent) => intent.userId === currentUser.id,
  );
  const activeMyActivities = myActivities.filter(
    (intent) => intent.status !== 'completed' && intent.status !== 'cancelled',
  );
  const inactiveMyActivities = myActivities.filter(
    (intent) => intent.status === 'completed' || intent.status === 'cancelled',
  );

  // Get activities I'm participating in (requested or approved)
  const myParticipatingRequests = effectiveActivityRequests.filter(
    (request) => request.userId === currentUser.id,
  );
  const pendingParticipating = myParticipatingRequests.filter((r) => r.status === 'pending');
  const approvedParticipating = myParticipatingRequests.filter((r) => r.status === 'approved');
  const declinedParticipating = myParticipatingRequests.filter((r) => r.status === 'declined');

  // Get the activities for participating view
  const getParticipatingActivities = (): Array<{
    request: ActivityRequest;
    activity: ActivityIntent;
  }> => {
    let requests: ActivityRequest[] = [];
    if (participatingFilter === 'pending') requests = pendingParticipating;
    else if (participatingFilter === 'approved') requests = approvedParticipating;
    else requests = declinedParticipating;

    return requests
      .map((request) => ({
        request,
        activity: effectiveActivityIntents.find((a) => a.id === request.activityId),
      }))
      .filter(
        (item): item is {request: ActivityRequest; activity: ActivityIntent} =>
          item.activity !== undefined,
      );
  };

  const handleCreateActivity = () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an activity title');
      return;
    }
    if (!maxPeople || parseInt(maxPeople) < 2) {
      Alert.alert('Error', 'Maximum people must be at least 2');
      return;
    }

    const newActivity = {
      title: title.trim(),
      description: description.trim(),
      maxPeople: parseInt(maxPeople),
      currentPeople: 1,
      scheduledTimes: scheduledTimes,
      campusLocation: location.trim() || undefined,
      status: 'active' as const,
    };

    onCreateActivity(newActivity);

    Alert.alert('Success', 'Activity created successfully!');

    // Reset form
    setTitle('');
    setDescription('');
    setMaxPeople('');
    setScheduledTimes([]);
    setLocation('');

    // Switch to organizing tab
    setViewMode('organizing');
  };

  const renderOrganizingActivityCard = ({item}: {item: ActivityIntent}) => {
    const fromApp = activityIntents.find((a) => a.id === item.id);
    const latest = fromApp || effectiveActivityIntents.find((a) => a.id === item.id) || item;
    const requestsForActivity = effectiveActivityRequests.filter(
      (r) => r.activityId === item.id && r.status === 'pending',
    );
    const approvedRequests = effectiveActivityRequests.filter(
      (r) => r.activityId === item.id && r.status === 'approved',
    );
    // Only show "new" badge for active activities
    const hasNewRequests = latest.status === 'active' && requestsForActivity.length > 0;

    return (
      <TouchableOpacity onPress={() => setSelectedActivity(latest)} activeOpacity={0.7}>
        <Card style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{latest.title}</Text>
              <Text style={styles.activityDescription} numberOfLines={2}>
                {latest.description}
              </Text>
            </View>
            {hasNewRequests && (
              <Badge variant="primary" style={styles.requestBadge}>
                {requestsForActivity.length} new
              </Badge>
            )}
          </View>

          <View style={styles.activityMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {Math.max(latest.currentPeople, approvedRequests.length + 1)}/{latest.maxPeople}
              </Text>
            </View>
            {latest.scheduledTimes[0] && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.metaText}>{latest.scheduledTimes[0]}</Text>
              </View>
            )}
          </View>

          {/* Show approved participants */}
          {approvedRequests.length > 0 && (
            <View style={styles.participantsSection}>
              <Text style={styles.participantsTitle}>Team Members</Text>
              <View style={styles.participantsList}>
                {approvedRequests.map((request) => {
                  const userData = mockUsers.find((user) => user.id === request.userId);
                  const hasContactInfo = userData && (userData.phone || userData.instagram);

                  return (
                    <View key={request.id} style={styles.participantItem}>
                      <View style={styles.participantInfo}>
                        <Ionicons name="person-circle" size={24} color={colors.primary} />
                        <View style={styles.participantDetails}>
                          <Text style={styles.participantName}>{request.userName}</Text>
                          {hasContactInfo && (
                            <View style={styles.participantContact}>
                              {userData?.phone && (
                                <View style={styles.contactItem}>
                                  <Ionicons
                                    name="call-outline"
                                    size={12}
                                    color={colors.textSecondary}
                                  />
                                  <Text style={styles.contactText}>{userData.phone}</Text>
                                </View>
                              )}
                              {userData?.instagram && (
                                <View style={styles.contactItem}>
                                  <Ionicons
                                    name="logo-instagram"
                                    size={12}
                                    color={colors.textSecondary}
                                  />
                                  <Text style={styles.contactText}>{userData.instagram}</Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => setSelectedActivity(latest)}
            >
              <Ionicons name="create-outline" size={16} color={colors.primary} />
              <Text style={styles.quickActionText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderParticipatingActivity = ({
    item,
  }: {
    item: {request: ActivityRequest; activity: ActivityIntent};
  }) => {
    const {request, activity} = item;
    // const statusColor =
    //   request.status === 'approved' ?
    //     colors.success :
    //     request.status === 'declined' ?
    //       colors.error :
    //       colors.warning;

    // Get all approved participants for this activity
    // const allApprovedRequests = activityRequests.filter(
    //   (r) => r.activityId === activity.id && r.status === 'approved',
    // );

    return (
      <TouchableOpacity
        onPress={() => setSelectedParticipatingActivity(activity)}
        activeOpacity={0.7}
      >
        <Card style={styles.participatingCard}>
          <View style={styles.participatingHeader}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Badge
              variant={
                request.status === 'approved'
                  ? 'success'
                  : request.status === 'declined'
                    ? 'destructive'
                    : 'secondary'
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </View>

          <Text style={styles.organizerText}>by {activity.userName}</Text>
          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity.description}
          </Text>

          <View style={styles.activityMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>
                {activity.currentPeople}/{activity.maxPeople}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* View Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'create' && styles.modeButtonActive]}
          onPress={() => setViewMode('create')}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={viewMode === 'create' ? '#fff' : colors.textSecondary}
          />
          <Text style={[styles.modeText, viewMode === 'create' && styles.modeTextActive]}>
            Create New
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'organizing' && styles.modeButtonActive]}
          onPress={() => setViewMode('organizing')}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={viewMode === 'organizing' ? '#fff' : colors.textSecondary}
          />
          <Text style={[styles.modeText, viewMode === 'organizing' && styles.modeTextActive]}>
            Organizing
          </Text>
          <View
            style={[
              styles.modeCountBadge,
              viewMode === 'organizing' && styles.modeCountBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.modeCountText,
                viewMode === 'organizing' && styles.modeCountTextActive,
              ]}
            >
              {activeMyActivities.length > 99 ? '99+' : activeMyActivities.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'participating' && styles.modeButtonActive]}
          onPress={() => setViewMode('participating')}
        >
          <Ionicons
            name="people-outline"
            size={20}
            color={viewMode === 'participating' ? '#fff' : colors.textSecondary}
          />
          <Text style={[styles.modeText, viewMode === 'participating' && styles.modeTextActive]}>
            Participating
          </Text>
          <View
            style={[
              styles.modeCountBadge,
              viewMode === 'participating' && styles.modeCountBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.modeCountText,
                viewMode === 'participating' && styles.modeCountTextActive,
              ]}
            >
              {myParticipatingRequests.length > 99 ? '99+' : myParticipatingRequests.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {viewMode === 'create' ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Card style={styles.formCard}>
            <View style={styles.formHeader}>
              <Ionicons name="create-outline" size={32} color={colors.primary} />
              <Text style={styles.formTitle}>Create New Activity</Text>
              <Text style={styles.formSubtitle}>
                Set up an activity and find buddies to join you
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Activity Title *</Text>
              <Input
                placeholder="e.g., Study for CSE 373 Midterm"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Description</Text>
              <Input
                placeholder="What will you be doing?"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={styles.textArea}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Maximum People *</Text>
              <Input
                placeholder="eg., 4"
                value={maxPeople}
                onChangeText={setMaxPeople}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Scheduled Time(s)</Text>
              <DateTimePicker selectedTimes={scheduledTimes} onTimesChange={setScheduledTimes} />
              <Text style={styles.helperText}>Pick specific dates and times from the calendar</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Location</Text>
              <Input
                placeholder="e.g., Suzzallo Library, IMA"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <Button onPress={handleCreateActivity} fullWidth>
              Create Activity
            </Button>
          </Card>
        </ScrollView>
      ) : viewMode === 'organizing' ? (
        <View style={styles.listContainer}>
          {/* Active/Inactive Toggle */}
          <View style={styles.subFilter}>
            <View style={styles.filterToggle}>
              <TouchableOpacity
                style={[
                  styles.filterToggleButton,
                  !showCompleted && styles.filterToggleButtonActive,
                ]}
                onPress={() => setShowCompleted(false)}
              >
                <Ionicons
                  name="play-circle-outline"
                  size={16}
                  color={!showCompleted ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[styles.filterToggleText, !showCompleted && styles.filterToggleTextActive]}
                >
                  Active
                </Text>
                <View style={[styles.countBadge, !showCompleted && styles.countBadgeActive]}>
                  <Text style={[styles.countText, !showCompleted && styles.countTextActive]}>
                    {activeMyActivities.length}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterToggleButton,
                  showCompleted && styles.filterToggleButtonActive,
                ]}
                onPress={() => setShowCompleted(true)}
              >
                <Ionicons
                  name="archive-outline"
                  size={16}
                  color={showCompleted ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[styles.filterToggleText, showCompleted && styles.filterToggleTextActive]}
                >
                  Inactive
                </Text>
                <View style={[styles.countBadge, showCompleted && styles.countBadgeActive]}>
                  <Text style={[styles.countText, showCompleted && styles.countTextActive]}>
                    {inactiveMyActivities.length}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={showCompleted ? inactiveMyActivities : activeMyActivities}
            renderItem={renderOrganizingActivityCard}
            keyExtractor={(item) => item.id}
            extraData={{
              intents: effectiveActivityIntents,
              appIntents: activityIntents,
              requests: effectiveActivityRequests,
            }}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
                <Text style={styles.emptyText}>
                  {showCompleted ? 'No inactive activities' : 'No activities yet'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {showCompleted
                    ? 'Completed or cancelled activities will appear here'
                    : 'Create a new activity to get started'}
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          {/* Participating Filter */}
          <View style={styles.subFilter}>
            <View style={styles.filterToggle}>
              <TouchableOpacity
                style={[
                  styles.filterToggleButton,
                  participatingFilter === 'pending' && styles.filterToggleButtonActive,
                ]}
                onPress={() => setParticipatingFilter('pending')}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={participatingFilter === 'pending' ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterToggleText,
                    participatingFilter === 'pending' && styles.filterToggleTextActive,
                  ]}
                >
                  Pending
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    participatingFilter === 'pending' && styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      participatingFilter === 'pending' && styles.countTextActive,
                    ]}
                  >
                    {pendingParticipating.length}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterToggleButton,
                  participatingFilter === 'approved' && styles.filterToggleButtonActive,
                ]}
                onPress={() => setParticipatingFilter('approved')}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={participatingFilter === 'approved' ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterToggleText,
                    participatingFilter === 'approved' && styles.filterToggleTextActive,
                  ]}
                >
                  Approved
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    participatingFilter === 'approved' && styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      participatingFilter === 'approved' && styles.countTextActive,
                    ]}
                  >
                    {approvedParticipating.length}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterToggleButton,
                  participatingFilter === 'declined' && styles.filterToggleButtonActive,
                ]}
                onPress={() => setParticipatingFilter('declined')}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color={participatingFilter === 'declined' ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterToggleText,
                    participatingFilter === 'declined' && styles.filterToggleTextActive,
                  ]}
                >
                  Declined
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    participatingFilter === 'declined' && styles.countBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      participatingFilter === 'declined' && styles.countTextActive,
                    ]}
                  >
                    {declinedParticipating.length}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={getParticipatingActivities()}
            renderItem={renderParticipatingActivity}
            keyExtractor={(item) => item.request.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color={colors.textMuted} />
                <Text style={styles.emptyText}>No {participatingFilter} activities</Text>
                <Text style={styles.emptySubtext}>
                  {participatingFilter === 'pending'
                    ? 'Your join requests will appear here'
                    : participatingFilter === 'approved'
                      ? 'Approved activities will appear here'
                      : 'Declined requests will appear here'}
                </Text>
              </View>
            }
          />
        </View>
      )}

      {/* Activity Detail Modal */}
      <Modal
        visible={selectedActivity !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedActivity(null)}
      >
        {selectedActivity &&
          (() => {
            // Always get the latest version of the activity from the state
            const currentActivity = effectiveActivityIntents.find(
              (a) => a.id === selectedActivity.id,
            );

            // If activity was deleted, close the modal
            if (!currentActivity) {
              setSelectedActivity(null);
              return null;
            }

            return (
              <ActivityDetailScreen
                activity={currentActivity}
                requests={effectiveActivityRequests.filter(
                  (r) => r.activityId === currentActivity.id,
                )}
                currentUser={currentUser}
                onClose={() => setSelectedActivity(null)}
                onUpdateActivity={(activityId, updates) => onUpdateActivity(activityId, updates)}
                onDeleteActivity={onDeleteActivity}
                onApproveRequest={onApproveRequest}
                onDeclineRequest={onDeclineRequest}
              />
            );
          })()}
      </Modal>

      {/* Participating Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedParticipatingActivity}
        visible={selectedParticipatingActivity !== null}
        onClose={() => setSelectedParticipatingActivity(null)}
        currentUserId={currentUser.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modeToggle: {
    flexDirection: 'row',
    margin: spacing.md,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 10,
  },
  modeTextActive: {
    color: '#fff',
  },
  modeCountBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    minWidth: 14,
    alignItems: 'center',
    marginLeft: 1,
  },
  modeCountBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeCountText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 8,
  },
  modeCountTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  formCard: {
    padding: spacing.lg,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  listContainer: {
    flex: 1,
  },
  subFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subFilterLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterToggle: {
    flexDirection: 'row',
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.lg,
    padding: 2,
    gap: 1,
  },
  filterToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  filterToggleButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterToggleText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 11,
  },
  filterToggleTextActive: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
    minWidth: 16,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 9,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: spacing.md,
  },
  activityCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  activityInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  activityTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activityDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  requestBadge: {
    alignSelf: 'flex-start',
  },
  activityMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickActionText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  participatingCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  participatingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  organizerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  participantsSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  participantsTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  participantsList: {
    gap: spacing.sm,
  },
  participantItem: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
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
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  participantContact: {
    gap: spacing.xs,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  contactText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
