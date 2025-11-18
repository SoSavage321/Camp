// src/screens/social/StudyBuddiesScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';
import { where } from 'firebase/firestore';
import StudyBuddyCard from '@/components/cards/StudyBuddyCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Chip from '@/components/ui/Chip';

const COURSES = ['All', 'ECO101', 'CS102', 'MTH201', 'BIO110', 'ENG120'];

export default function StudyBuddiesScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const [buddies, setBuddies] = useState<User[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    loadBuddies();
  }, [selectedCourse]);

  const loadBuddies = async () => {
    try {
      setIsLoading(true);
      
      const constraints = [
        where('id', '!=', user?.id), // Exclude current user
      ];

      if (selectedCourse !== 'All') {
        constraints.push(where('course', '==', selectedCourse));
      }

      const users = await FirestoreService.getDocuments<User>('users', constraints);
      setBuddies(users);
    } catch (error) {
      console.error('Failed to load buddies:', error);
      Alert.alert('Error', 'Failed to load study buddies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (buddyId: string) => {
    try {
      setConnectingId(buddyId);
      
      // TODO: Create chat or send connection request
      // For now, just create a DM chat
      const chatData = {
        type: 'dm' as const,
        subjectId: buddyId,
        participants: [user!.id, buddyId],
      };

      const chatId = await FirestoreService.addDocument('chats', chatData);

      Alert.alert('Success', 'Chat created! You can now message them.', [
        {
          text: 'Open Chat',
          onPress: () => navigation.navigate('ChatTab', {
            screen: 'ChatThread',
            params: { chatId, chatName: 'Study Buddy', chatType: 'dm' }
          }),
        },
        { text: 'Later', style: 'cancel' },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to connect');
    } finally {
      setConnectingId(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filters}>
        {COURSES.map((course) => (
          <Chip
            key={course}
            label={course}
            selected={selectedCourse === course}
            onPress={() => setSelectedCourse(course)}
          />
        ))}
      </View>

      {/* Buddies List */}
      {buddies.length > 0 ? (
        <FlatList
          data={buddies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudyBuddyCard
              user={item}
              onConnect={() => handleConnect(item.id)}
              isConnecting={connectingId === item.id}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          title="No study buddies found"
          description="Try selecting a different course"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 24,
  },
});