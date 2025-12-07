import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {User} from '../types';
import {Modal} from './Modal';
import {Input} from './Input';
import {Button} from './Button';
import {Badge} from './Badge';
import {colors, spacing, typography} from '../theme';

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
};

// Phone number validation function
const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return true; // Empty is valid (optional field)

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');

  // Accept 10-digit US phone numbers
  if (digitsOnly.length !== 10) return false;

  // Common formats: (206) 555-0123, 206-555-0123, 206.555.0123, 2065550123
  const phoneRegex = /^(\d{10}|(\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4})$/;
  return phoneRegex.test(phone);
};

export function EditProfileModal({visible, onClose, user, onSave}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    phone: user.phone || '',
    instagram: user.instagram || '',
    contactEmail: user.contactEmail || '',
    campusLocation: user.campusLocation || '',
  });

  const [activityTags, setActivityTags] = useState<string[]>(user.activityTags);
  const [preferredTimes, setPreferredTimes] = useState<string[]>(user.preferredTimes);

  const [newTag, setNewTag] = useState('');
  const [newTime, setNewTime] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateAndSetPhone = (text: string) => {
    setFormData({...formData, phone: text});

    if (text.trim() === '') {
      setPhoneError('');
    } else if (!isValidPhoneNumber(text)) {
      setPhoneError('Invalid phone format. Use: (206) 555-0123 or 206-555-0123');
    } else {
      setPhoneError('');
    }
  };

  const handleSave = async () => {
    // Validate name is not empty
    if (!formData.name || formData.name.trim() === '') {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }

    // Validate phone number before saving
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit US phone number.');
      return;
    }

    // Convert empty strings to empty string (backend will convert to null)
    // This ensures only name is required, all other fields are optional
    const updatedUser: User = {
      ...user,
      name: formData.name.trim(),
      bio: formData.bio.trim() || '',
      phone: formData.phone.trim() || '',
      instagram: formData.instagram.trim() || '',
      contactEmail: formData.contactEmail.trim() || '', // Empty string will be converted to null by backend
      campusLocation: formData.campusLocation.trim() || '',
      activityTags,
      preferredTimes,
    };

    try {
      await onSave(updatedUser);
      // Only close modal if save was successful
      onClose();
    } catch (error) {
      // Error is already handled in App.tsx, just don't close the modal
    }
  };

  const addTag = () => {
    if (newTag.trim() && !activityTags.includes(newTag.trim())) {
      setActivityTags([...activityTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setActivityTags(activityTags.filter((t) => t !== tag));
  };

  const addTime = () => {
    if (newTime.trim() && !preferredTimes.includes(newTime.trim())) {
      setPreferredTimes([...preferredTimes, newTime.trim()]);
      setNewTime('');
    }
  };

  const removeTime = (time: string) => {
    setPreferredTimes(preferredTimes.filter((t) => t !== time));
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Edit Profile">
      <View style={styles.container}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Input
            label="Name *"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="Enter your name"
          />
          <Input
            label="Bio"
            value={formData.bio}
            onChangeText={(text) => setFormData({...formData, bio: text})}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={3}
            style={{height: 80, textAlignVertical: 'top', paddingTop: spacing.sm}}
          />
        </View>

        {/* Activity Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Interests</Text>
          <View style={styles.tagsContainer}>
            {activityTags.map((tag, index) => (
              <Badge key={index} variant="secondary" style={styles.tag}>
                <View style={styles.tagContent}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </Badge>
            ))}
          </View>
          <View style={styles.addRow}>
            <Input
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add interest tag"
              containerStyle={styles.addInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTag}>
              <Ionicons name="add-circle" size={32} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferred Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Times</Text>
          <View style={styles.timesList}>
            {preferredTimes.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.timeText}>{time}</Text>
                <TouchableOpacity onPress={() => removeTime(time)} style={styles.removeButton}>
                  <Ionicons name="close-circle" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.addRow}>
            <Input
              value={newTime}
              onChangeText={setNewTime}
              placeholder="e.g., Weekday evenings, Weekend afternoons"
              containerStyle={styles.addInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTime}>
              <Ionicons name="add-circle" size={32} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Input
            label="Campus Location"
            value={formData.campusLocation}
            onChangeText={(text) => setFormData({...formData, campusLocation: text})}
            placeholder="e.g., North Campus Dorms"
          />
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View>
            <Input
              label="Phone"
              value={formData.phone}
              onChangeText={validateAndSetPhone}
              placeholder="(206) 555-0123"
              keyboardType="phone-pad"
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>
          <Input
            label="Instagram"
            value={formData.instagram}
            onChangeText={(text) => setFormData({...formData, instagram: text})}
            placeholder="@your_instagram_handle"
            autoCapitalize="none"
          />
          <Input
            label="Contact Email"
            value={formData.contactEmail}
            onChangeText={(text) => setFormData({...formData, contactEmail: text})}
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button onPress={handleSave} fullWidth>
            Save Changes
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tagText: {
    ...typography.bodySmall,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  addInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    marginBottom: 2,
  },
  timesList: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: 8,
  },
  timeText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  removeButton: {
    padding: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
});
