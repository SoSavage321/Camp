// src/navigation/StudyNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudyStackParamList } from './types';

import StudyMainScreen from '@/screens/study/StudyMainScreen';
import TaskDetailScreen from '@/screens/study/TaskDetailScreen';
import CramModeScreen from '@/screens/study/CramModeScreen';
import StudyRoomScreen from '@/screens/study/StudyRoomScreen';
import CalendarScreen from '@/screens/study/CalendarScreen';

const Stack = createNativeStackNavigator<StudyStackParamList>();

export default function StudyNavigator() {
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
        name="StudyMain"
        component={StudyMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Task' }}
      />
      <Stack.Screen
        name="CramMode"
        component={CramModeScreen}
        options={{ title: 'Cram Mode', presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="StudyRoom"
        component={StudyRoomScreen}
        options={{ title: 'Study Room' }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Calendar' }}
      />
    </Stack.Navigator>
  );
}