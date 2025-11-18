import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

interface StudyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'exam' | 'assignment' | 'study' | 'class';
  description?: string;
}

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState<StudyEvent[]>([
    {
      id: '1',
      title: 'Math Final Exam',
      date: '2025-11-20',
      time: '10:00 AM',
      type: 'exam',
      description: 'Chapter 1-5',
    },
    {
      id: '2',
      title: 'Physics Assignment',
      date: '2025-11-18',
      time: '11:59 PM',
      type: 'assignment',
      description: 'Problem Set 7',
    },
    {
      id: '3',
      title: 'Study Group',
      date: '2025-11-19',
      time: '3:00 PM',
      type: 'study',
      description: 'Library Room 203',
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'study' as StudyEvent['type'],
    description: '',
  });

  const markedDates = events.reduce((acc, event) => {
    acc[event.date] = {
      marked: true,
      dotColor: getEventColor(event.type),
    };
    return acc;
  }, {} as any);

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#6366f1',
    };
  }

  function getEventColor(type: StudyEvent['type']) {
    switch (type) {
      case 'exam':
        return '#ef4444';
      case 'assignment':
        return '#f59e0b';
      case 'study':
        return '#10b981';
      case 'class':
        return '#3b82f6';
      default:
        return '#6366f1';
    }
  }

  const selectedEvents = events.filter((e) => e.date === selectedDate);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time && selectedDate) {
      const event: StudyEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: selectedDate,
        time: newEvent.time,
        type: newEvent.type,
        description: newEvent.description,
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', time: '', type: 'study', description: '' });
      setShowAddModal(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Calendar</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        style={styles.calendar}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#6366f1',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#6366f1',
          dayTextColor: '#1f2937',
          textDisabledColor: '#d1d5db',
          dotColor: '#6366f1',
          selectedDotColor: '#ffffff',
          arrowColor: '#6366f1',
          monthTextColor: '#1f2937',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markingType="dot"
      />

      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>
          {selectedDate
            ? `Events on ${new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}`
            : 'Select a date to view events'}
        </Text>

        <ScrollView style={styles.eventsList}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
                {event.description && (
                  <Text style={styles.eventDescription}>
                    {event.description}
                  </Text>
                )}
                <View
                  style={[
                    styles.eventTypeBadge,
                    { backgroundColor: getEventColor(event.type) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventTypeText,
                      { color: getEventColor(event.type) },
                    ]}
                  >
                    {event.type.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))
          ) : selectedDate ? (
            <Text style={styles.noEventsText}>No events on this day</Text>
          ) : null}
        </ScrollView>
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Event</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={newEvent.title}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, title: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 10:00 AM)"
              value={newEvent.time}
              onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              value={newEvent.description}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, description: text })
              }
              multiline
            />

            <Text style={styles.typeLabel}>Event Type</Text>
            <View style={styles.typeButtons}>
              {(['exam', 'assignment', 'study', 'class'] as const).map(
                (type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      {
                        borderColor: getEventColor(type),
                        backgroundColor:
                          newEvent.type === type
                            ? getEventColor(type)
                            : 'transparent',
                      },
                    ]}
                    onPress={() => setNewEvent({ ...newEvent, type })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: newEvent.type === type ? '#fff' : getEventColor(type) },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddEvent}
            >
              <Text style={styles.saveButtonText}>Add Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  eventTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  eventTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noEventsText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CalendarScreen;