    import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface EditEventScreenProps {
  navigation: any;
  route: any;
}

const EditEventScreen: React.FC<EditEventScreenProps> = ({ navigation, route }) => {
  const eventData = route?.params?.event;

  const [title, setTitle] = useState(eventData?.title || '');
  const [description, setDescription] = useState(eventData?.description || '');
  const [location, setLocation] = useState(eventData?.location || '');
  const [date, setDate] = useState(eventData?.date ? new Date(eventData.date) : new Date());
  const [startTime, setStartTime] = useState(eventData?.startTime ? new Date(eventData.startTime) : new Date());
  const [endTime, setEndTime] = useState(eventData?.endTime ? new Date(eventData.endTime) : new Date());
  const [capacity, setCapacity] = useState(eventData?.capacity?.toString() || '');
  const [category, setCategory] = useState(eventData?.category || 'General');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['General', 'Academic', 'Social', 'Sports', 'Cultural', 'Workshop', 'Meeting'];

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    setLoading(true);

    // TODO: Implement your API call here
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Event updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1000);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement delete API call
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Event</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event title"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter event description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter location"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.section, styles.halfWidth]}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.dateText}>
                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(Platform.OS === 'ios');
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            )}
          </View>

          <View style={[styles.section, styles.halfWidth]}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.dateText}>
                {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(Platform.OS === 'ios');
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Capacity (Optional)</Text>
          <TextInput
            style={styles.input}
            value={capacity}
            onChangeText={setCapacity}
            placeholder="Maximum attendees"
            placeholderTextColor="#999"
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.deleteText}>Delete Event</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    padding: 4,
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    marginTop: 12,
    gap: 8,
  },
  deleteText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});

export default EditEventScreen;