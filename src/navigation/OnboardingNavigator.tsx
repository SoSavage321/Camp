// src/navigation/OnboardingNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';

import ProfileSetupScreen from '@/screens/onboarding/ProfileSetupScreen';
import NotificationSetupScreen from '@/screens/onboarding/NotificationSetupScreen';
import CompleteScreen from '@/screens/onboarding/CompleteScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="NotificationSetup" component={NotificationSetupScreen} />
      <Stack.Screen name="Complete" component={CompleteScreen} />
    </Stack.Navigator>
  );
}
