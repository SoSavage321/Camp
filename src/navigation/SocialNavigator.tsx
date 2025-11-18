// src/navigation/SocialNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SocialStackParamList } from './types';

import SocialMainScreen from '@/screens/social/SocialMainScreen';
import EventDetailScreen from '@/screens/social/EventDetailScreen';
import CreateEventScreen from '@/screens/social/CreateEventScreen';
import EditEventScreen from '@/screens/social/EditEventScreen';
import GroupDetailScreen from '@/screens/social/GroupDetailScreen';
import StudyBuddiesScreen from '@/screens/social/StudyBuddiesScreen';
import UserProfileScreen from '@/screens/social/UserProfileScreen';

const Stack = createNativeStackNavigator<SocialStackParamList>();

export default function SocialNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: '600',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="SocialMain"
        component={SocialMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: 'Event' }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: 'Create Event' }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ title: 'Edit Event' }}
      />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: 'Group' }}
      />
      <Stack.Screen
        name="StudyBuddies"
        component={StudyBuddiesScreen}
        options={{ title: 'Study Buddies' }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}