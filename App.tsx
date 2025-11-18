import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';

import RootNavigator from './src/navigation/RootNavigator';

// =====================
// NOTIFICATION HANDLER
// =====================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// =====================
// REACT QUERY CLIENT
// =====================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// =====================
// MAIN APP
// =====================
export default function App() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
        <StatusBar style="auto" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
