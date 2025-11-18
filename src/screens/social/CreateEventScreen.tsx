// src/screens/social/CreateEventScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SocialStackParamList } from '@/navigation/types';
import { useEventStore } from '@/store/eventStore';
import { EventCategory, EventVisibility, LocationType } from '@/types';
import Input from '@/components/ui/Input';
import  Button  from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Camera, MapPin, Link as LinkIcon } from 'lucide-react-native';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<SocialStackParamList, 'CreateEvent'>;

export default function CreateEventScreen({ navigation }: Props) {
  const { createEvent, isLoading } = useEventStore();

  const [coverUrl, setCoverUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('social');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [locationType, setLocationType] = useState<LocationType>('physical');
  const [location, setLocation] = useState('');
  const [visibility, setVisibility] = useState<EventVisibility>('public');
  const [capacity, setCapacity] = useState('');

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    location?: string;
  }>({});

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // TODO: Upload to Firebase Storage
      setCoverUrl(result.assets[0].uri);
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (endDate <= startDate) {
      Alert.alert('Invalid Time', 'End time must be after start time');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        coverUrl: coverUrl || undefined,
        category,
        startsAt: startDate,
        endsAt: endDate,
        location: {
          type: locationType,
          value: location.trim(),
        },
        visibility,
        capacity: capacity ? parseInt(capacity) : undefined,
      });

      Alert.alert('Success', 'Event created successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    }
  };

  const categories: EventCategory[] = ['social', 'study', 'sports', 'culture', 'other'];
  const visibilities: EventVisibility[] = ['public', 'group', 'private'];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Cover Image */}
        <TouchableOpacity style={styles.coverButton} onPress={handlePickImage}>
          {coverUrl ? (
            <Image source={{ uri: coverUrl }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Camera size={32} color="#9CA3AF" />
              <Text style={styles.coverPlaceholderText}>Add Cover Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Input
          label="Event Title *"
          placeholder="e.g., Sunset Social"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <Input
          label="Description *"
          placeholder="Tell people what this event is about..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.descriptionInput}
          error={errors.description}
        />

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.chips}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                selected={category === cat}
                onPress={() => setCategory(cat)}
              />
            ))}
          </View>
        </View>

        <Input
          label="Capacity (Optional)"
          placeholder="Maximum number of attendees"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="number-pad"
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Create Event"
          onPress={handleCreate}
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        />
      </View>

      {/* Date Time Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartDate(selectedTime);
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndDate(selectedTime);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  coverButton: {
    marginBottom: 24,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  coverPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  coverPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 8,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});

