// src/screens/profile/EditProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Avatar from '@/components/ui/Avatar';

const INTERESTS = [
  'Sports', 'Music', 'Art', 'Technology', 'Gaming', 'Reading',
  'Cooking', 'Travel', 'Photography', 'Fitness', 'Movies', 'Fashion',
];

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateProfile, isLoading } = useAuthStore();

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [name, setName] = useState(user?.name || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || []
  );

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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        avatarUrl,
        interests: selectedInterests,
      });

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Avatar
            name={name || user?.name || 'User'}
            imageUrl={avatarUrl}
            size={100}
          />
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={handlePickImage}
          >
            <Camera size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <Input
          label="Name"
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
        />

        {/* Read-only fields */}
        <Input
          label="Email"
          value={user?.email}
          editable={false}
          style={styles.disabledInput}
        />

        <Input
          label="Course"
          value={user?.course}
          editable={false}
          style={styles.disabledInput}
        />

        <Input
          label="Year"
          value={user?.year.toString()}
          editable={false}
          style={styles.disabledInput}
        />

        {/* Interests */}
        <View style={styles.section}>
          <Input label="Interests" value="" editable={false} containerStyle={{ marginBottom: 0 }} />
          <View style={styles.chips}>
            {INTERESTS.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                selected={selectedInterests.includes(interest)}
                onPress={() => toggleInterest(interest)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        />
      </View>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  avatarButton: {
    position: 'absolute',
    right: '35%',
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
