import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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

export function EditProfileModal({visible, onClose, user, onSave}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    phone: user.phone || '',
    instagram: user.instagram || '',
    campusLocation: user.campusLocation || '',
  });

  const [activityTags, setActivityTags] = useState<string[]>(user.activityTags);
  const [skills, setSkills] = useState<string[]>(user.skills);
  const [preferredTimes, setPreferredTimes] = useState<string[]>(user.preferredTimes);

  const [newTag, setNewTag] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      phone: formData.phone,
      instagram: formData.instagram,
      campusLocation: formData.campusLocation,
      activityTags,
      skills,
      preferredTimes,
    };
    onSave(updatedUser);
    onClose();
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

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
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
            label="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
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
          <Text style={styles.sectionTitle}>Activities & Interests</Text>
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

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Experience</Text>
          <View style={styles.tagsContainer}>
            {skills.map((skill, index) => (
              <Badge key={index} variant="outline" style={styles.tag}>
                <View style={styles.tagContent}>
                  <Text style={styles.tagText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)}>
                    <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </Badge>
            ))}
          </View>
          <View style={styles.addRow}>
            <Input
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Add skill"
              containerStyle={styles.addInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={addSkill}>
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

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Input
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          <Input
            label="Instagram"
            value={formData.instagram}
            onChangeText={(text) => setFormData({...formData, instagram: text})}
            placeholder="@your_instagram_handle"
            autoCapitalize="none"
          />
          <Input
            label="Campus Location"
            value={formData.campusLocation}
            onChangeText={(text) => setFormData({...formData, campusLocation: text})}
            placeholder="e.g., North Campus Dorms"
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
});
