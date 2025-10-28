import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Button} from './Button';
import {colors, spacing, typography, borderRadius} from '../theme';

type DateTimePickerProps = {
  selectedTimes: string[];
  onTimesChange: (times: string[]) => void;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DateTimePicker({selectedTimes, onTimesChange}: DateTimePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Time state
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [isPM, setIsPM] = useState(false);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const formatDateTime = (date: Date, hour: string, minute: string, isPM: boolean) => {
    const monthName = MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hourNum = parseInt(hour);
    if (isPM && hourNum !== 12) hourNum += 12;
    if (!isPM && hourNum === 12) hourNum = 0;

    const minStr = minute.padStart(2, '0');
    const ampm = isPM ? 'PM' : 'AM';
    const displayHour = parseInt(hour) === 0 ? '12' : hour;

    return `${monthName} ${day}, ${year} at ${displayHour}:${minStr} ${ampm}`;
  };

  const handleAddTime = () => {
    if (!selectedDate || !hour || !minute) {
      return;
    }

    const hourNum = parseInt(hour);
    const minNum = parseInt(minute);

    if (hourNum < 1 || hourNum > 12 || minNum < 0 || minNum > 59) {
      return;
    }

    const formattedDateTime = formatDateTime(selectedDate, hour, minute, isPM);

    if (!selectedTimes.includes(formattedDateTime)) {
      onTimesChange([...selectedTimes, formattedDateTime]);
    }

    // Reset
    setSelectedDate(null);
    setHour('');
    setMinute('');
    setIsPM(false);
    setModalVisible(false);
  };

  const handleRemoveTime = (timeToRemove: string) => {
    onTimesChange(selectedTimes.filter((time) => time !== timeToRemove));
  };

  const calendarDays = generateCalendarDays();

  return (
    <View style={styles.container}>
      {/* Selected Times Display */}
      <View style={styles.selectedTimesContainer}>
        {selectedTimes.map((time, index) => (
          <View key={index} style={styles.timeChip}>
            <Text style={styles.timeChipText}>{time}</Text>
            <TouchableOpacity onPress={() => handleRemoveTime(time)} style={styles.removeButton}>
              <Ionicons name="close-circle" size={18} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Time Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.addButtonText}>
          {selectedTimes.length === 0 ? 'Add Scheduled Time' : 'Add Another Time'}
        </Text>
      </TouchableOpacity>

      {/* Date Time Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date & Time</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Calendar Header */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
                  <Ionicons name="chevron-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.monthYear}>
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                  <Ionicons name="chevron-forward" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Day Labels */}
              <View style={styles.dayLabelsRow}>
                {DAY_LABELS.map((label) => (
                  <View key={label} style={styles.dayLabel}>
                    <Text style={styles.dayLabelText}>{label}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {calendarDays.map((day, index) => (
                  <View key={index} style={styles.dayCell}>
                    {day !== null && (
                      <TouchableOpacity
                        style={[
                          styles.dayButton,
                          isDateSelected(day) && styles.dayButtonSelected,
                          isPastDate(day) && styles.dayButtonDisabled,
                        ]}
                        onPress={() => handleDateSelect(day)}
                        disabled={isPastDate(day)}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isDateSelected(day) && styles.dayTextSelected,
                            isPastDate(day) && styles.dayTextDisabled,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              {/* Time Input */}
              <View style={styles.timeSection}>
                <Text style={styles.sectionLabel}>Select Time</Text>
                <View style={styles.timeInputRow}>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="HH"
                    placeholderTextColor={colors.textMuted}
                    value={hour}
                    onChangeText={(text) => {
                      const num = text.replace(/[^0-9]/g, '');
                      if (num === '' || (parseInt(num) >= 1 && parseInt(num) <= 12)) {
                        setHour(num);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={styles.timeSeparator}>:</Text>
                  <TextInput
                    style={styles.timeInput}
                    placeholder="MM"
                    placeholderTextColor={colors.textMuted}
                    value={minute}
                    onChangeText={(text) => {
                      const num = text.replace(/[^0-9]/g, '');
                      if (num === '' || (parseInt(num) >= 0 && parseInt(num) <= 59)) {
                        setMinute(num);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />

                  <View style={styles.ampmToggle}>
                    <TouchableOpacity
                      style={[styles.ampmButton, !isPM && styles.ampmButtonActive]}
                      onPress={() => setIsPM(false)}
                    >
                      <Text style={[styles.ampmText, !isPM && styles.ampmTextActive]}>AM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.ampmButton, isPM && styles.ampmButtonActive]}
                      onPress={() => setIsPM(true)}
                    >
                      <Text style={[styles.ampmText, isPM && styles.ampmTextActive]}>PM</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Button
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={styles.actionButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleAddTime}
                disabled={!selectedDate || !hour || !minute}
                style={styles.actionButton}
              >
                Add Time
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  selectedTimesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: 40,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  timeChipText: {
    ...typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: spacing.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  addButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  modalBody: {
    padding: spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.xs,
  },
  monthYear: {
    ...typography.h3,
    color: colors.text,
  },
  dayLabelsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayLabel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dayLabelText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
  },
  dayButtonDisabled: {
    backgroundColor: 'transparent',
  },
  dayText: {
    ...typography.body,
    color: colors.text,
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayTextDisabled: {
    color: colors.textMuted,
  },
  timeSection: {
    marginTop: spacing.md,
  },
  sectionLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeInput: {
    width: 60,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    backgroundColor: colors.background,
  },
  timeSeparator: {
    ...typography.h3,
    color: colors.text,
  },
  ampmToggle: {
    flexDirection: 'row',
    marginLeft: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 2,
  },
  ampmButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  ampmButtonActive: {
    backgroundColor: colors.primary,
  },
  ampmText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  ampmTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
  },
});
