// src/navigation/ProfileNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';

import ProfileMainScreen from '@/screens/profile/ProfileMainScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import SettingsScreen from '@/screens/profile/SettingsScreen';
import NotificationsScreen from '@/screens/profile/NotificationsScreen';
import SafetyScreen from '@/screens/profile/SafetyScreen';
import BlockedUsersScreen from '@/screens/profile/BlockedUsersScreen';
import AdminScreen from '@/screens/profile/admin/AdminScreen';
import ReportsScreen from '@/screens/profile/admin/ReportsScreen';
import PendingEventsScreen from '@/screens/profile/admin/PendingEventsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
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
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="Safety"
        component={SafetyScreen}
        options={{ title: 'Safety & Privacy' }}
      />
      <Stack.Screen
        name="BlockedUsers"
        component={BlockedUsersScreen}
        options={{ title: 'Blocked Users' }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: 'Admin Console' }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ title: 'Reports' }}
      />
      <Stack.Screen
        name="PendingEvents"
        component={PendingEventsScreen}
        options={{ title: 'Pending Events' }}
      />
    </Stack.Navigator>
  );
}