
// src/screens/onboarding/ProfileSetupScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Avatar from '@/components/ui/Avatar';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProfileSetup'>;

const COURSES = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Law',
  'Arts & Humanities',
  'Social Sciences',
  'Natural Sciences',
  'Education',
  'Other',
];

const INTERESTS = [
  'Sports',
  'Music',
  'Art',
  'Technology',
  'Gaming',
  'Reading',
  'Cooking',
  'Travel',
  'Photography',
  'Fitness',
  'Movies',
  'Fashion',
];

export default function ProfileSetupScreen({ navigation }: Props) {
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [course, setCourse] = useState(user?.course || '');
  const [year, setYear] = useState(user?.year?.toString() || '1');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  
  const [errors, setErrors] = useState<{
    course?: string;
    year?: string;
    interests?: string;
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
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      // TODO: Upload to Firebase Storage
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const validate = () => {
    const newErrors: any = {};

    if (!course) {
      newErrors.course = 'Please select your course';
    }

    const yearNum = parseInt(year);
    if (!year || yearNum < 1 || yearNum > 7) {
      newErrors.year = 'Please enter a valid year (1-7)';
    }

    if (selectedInterests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    try {
      await updateProfile({
        avatarUrl,
        course,
        year: parseInt(year),
        interests: selectedInterests,
      });
      navigation.navigate('NotificationSetup');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help others find and connect with you
          </Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Avatar
            name={user?.name || 'User'}
            imageUrl={avatarUrl}
            size={100}
          />
          <TouchableOpacity style={styles.avatarButton} onPress={handlePickImage}>
            <Camera size={20} color="#3B82F6" />
            <Text style={styles.avatarButtonText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Course Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Course *</Text>
          <TouchableOpacity
            style={[styles.dropdown, errors.course && styles.inputError]}
            onPress={() => setShowCourseDropdown(!showCourseDropdown)}
          >
            <Text style={[styles.dropdownText, !course && styles.placeholder]}>
              {course || 'Select your course'}
            </Text>
          </TouchableOpacity>
          {errors.course && <Text style={styles.error}>{errors.course}</Text>}
          
          {showCourseDropdown && (
            <View style={styles.dropdownList}>
              {COURSES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCourse(c);
                    setShowCourseDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Year */}
        <Input
          label="Year of Study *"
          placeholder="1"
          value={year}
          onChangeText={setYear}
          keyboardType="number-pad"
          error={errors.year}
          hint="Enter 1-7 for undergraduate/postgraduate"
        />

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.label}>Interests * (Select at least 1)</Text>
          <View style={styles.chipsContainer}>
            {INTERESTS.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                selected={selectedInterests.includes(interest)}
                onPress={() => toggleInterest(interest)}
              />
            ))}
          </View>
          {errors.interests && <Text style={styles.error}>{errors.interests}</Text>}
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          style={styles.continueButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  avatarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  dropdown: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111827',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  continueButton: {
    marginTop: 16,
  },
});