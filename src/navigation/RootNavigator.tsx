// src/navigation/RootNavigator.tsx

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { AuthService } from '@/services/firebase/auth.service';

import SplashScreen from '@/screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const { setUser, user } = useAuthStore();
  const { isOnboarded } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await AuthService.getUserData(firebaseUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
