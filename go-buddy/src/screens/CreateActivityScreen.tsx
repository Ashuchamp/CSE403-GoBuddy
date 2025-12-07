import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User, ActivityIntent} from '../types';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {ActivityCard} from '../components/ActivityCard';
import {LocationPicker, SelectedLocation} from '../components/LocationPicker';
import {colors, spacing, typography} from '../theme';

type CreateActivityScreenProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  onCreateActivity: (
    activity: Omit<ActivityIntent, 'id' | 'userId' | 'userName' | 'createdAt'>,
  ) => void;
};

type ViewMode = 'create' | 'active' | 'inactive';

export function CreateActivityScreen({
  currentUser,
  activityIntents,
  onCreateActivity,
}: CreateActivityScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('create');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxPeople, setMaxPeople] = useState('4');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [tags, setTags] = useState('');

  // Get user's activities
  const userActivities = activityIntents.filter((intent) => intent.userId === currentUser.id);

  // Split into active and inactive (using currentPeople as a simple indicator)
  const activeActivities = userActivities.filter(
    (intent) => intent.currentPeople < intent.maxPeople,
  );
  const inactiveActivities = userActivities.filter(
    (intent) => intent.currentPeople >= intent.maxPeople,
  );

  const handleCreateActivity = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an activity title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!maxPeople || parseInt(maxPeople) < 2) {
      Alert.alert('Error', 'Maximum people must be at least 2');
      return;
    }
    if (!scheduledTime.trim()) {
      Alert.alert('Error', 'Please enter a scheduled time');
      return;
    }

    const newActivity = {
      title: title.trim(),
      description: description.trim(),
      maxPeople: parseInt(maxPeople),
      currentPeople: 1,
      scheduledTimes: scheduledTime.split(',').map((t) => t.trim()),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t),
      // New location fields
      latitude: selectedLocation?.latitude,
      longitude: selectedLocation?.longitude,
      locationName: selectedLocation?.name,
      // Legacy field for backward compatibility
      campusLocation: selectedLocation?.name || undefined,
    };

    try {
      await onCreateActivity(newActivity);
      // Only show success if activity was created successfully
      Alert.alert('Success', 'Activity created successfully!');

      // Switch to Active tab to show the newly created activity
      setViewMode('active');

      // Reset form
      setTitle('');
      setDescription('');
      setMaxPeople('4');
      setScheduledTime('');
      setSelectedLocation(null);
      setTags('');
    } catch (error) {
      // Error is already handled in App.tsx, just don't show success or reset form
    }
  };

  const renderActivityCard = ({item}: {item: ActivityIntent}) => (
    <ActivityCard intent={item} showActions={false} />
  );

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
            Create
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'active' && styles.modeButtonActive]}
          onPress={() => setViewMode('active')}
        >
          <Ionicons
            name="play-circle-outline"
            size={20}
            color={viewMode === 'active' ? '#fff' : colors.textSecondary}
          />
          <Text style={[styles.modeText, viewMode === 'active' && styles.modeTextActive]}>
            Active ({activeActivities.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, viewMode === 'inactive' && styles.modeButtonActive]}
          onPress={() => setViewMode('inactive')}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={viewMode === 'inactive' ? '#fff' : colors.textSecondary}
          />
          <Text style={[styles.modeText, viewMode === 'inactive' && styles.modeTextActive]}>
            Inactive ({inactiveActivities.length})
          </Text>
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
              <Text style={styles.label}>Description *</Text>
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
                placeholder="4"
                value={maxPeople}
                onChangeText={setMaxPeople}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Scheduled Time(s) *</Text>
              <Input
                placeholder="e.g., Monday 3pm, Wednesday 5pm"
                value={scheduledTime}
                onChangeText={setScheduledTime}
              />
              <Text style={styles.helperText}>Separate multiple times with commas</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity
                onPress={() => setShowLocationPicker(true)}
                style={styles.locationPickerButton}
              >
                <Ionicons
                  name={selectedLocation ? 'location' : 'location-outline'}
                  size={20}
                  color={selectedLocation ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.locationPickerText,
                    selectedLocation && styles.locationPickerTextSelected,
                  ]}
                >
                  {selectedLocation?.name || 'Tap to select location on map'}
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Tags</Text>
              <Input
                placeholder="e.g., Study, CSE 373, Midterm Prep"
                value={tags}
                onChangeText={setTags}
              />
              <Text style={styles.helperText}>Separate tags with commas</Text>
            </View>

            <Button onPress={handleCreateActivity} fullWidth>
              Create Activity
            </Button>
          </Card>
        </ScrollView>
      ) : viewMode === 'active' ? (
        <FlatList
          data={activeActivities}
          renderItem={renderActivityCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              Your active activities ({activeActivities.length})
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyText}>No active activities</Text>
              <Text style={styles.emptySubtext}>Create a new activity to get started</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={inactiveActivities}
          renderItem={renderActivityCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.listHeader}>
              Your completed activities ({inactiveActivities.length})
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyText}>No completed activities</Text>
              <Text style={styles.emptySubtext}>Completed activities will appear here</Text>
            </View>
          }
        />
      )}

      {/* Location Picker Modal */}
      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelect={(location) => {
          setSelectedLocation(location);
          setShowLocationPicker(false);
        }}
        initialLocation={selectedLocation || undefined}
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
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 6,
    gap: 4,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modeTextActive: {
    color: '#fff',
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
  helperText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  listHeader: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.md,
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
  },
  locationPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  locationPickerText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  locationPickerTextSelected: {
    color: colors.text,
    fontWeight: '500',
  },
});
