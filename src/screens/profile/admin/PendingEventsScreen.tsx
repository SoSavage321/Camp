// src/screens/profile/admin/PendingEventsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { Event } from '@/types';
import { where } from 'firebase/firestore';
import EventCard from '@/components/cards/EventCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Calendar } from 'lucide-react-native';

export default function PendingEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const loadPendingEvents = async () => {
    try {
      setIsLoading(true);
      const constraints = [where('status', '==', 'pending')];
      const pendingEvents = await FirestoreService.getDocuments<Event>('events', constraints);
      setEvents(pendingEvents);
    } catch (error) {
      Alert.alert('Error', 'Failed to load pending events');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPendingEvents();
    setRefreshing(false);
  };

  const handleApprove = async (eventId: string) => {
    try {
      setProcessingId(eventId);
      await FirestoreService.updateDocument('events', eventId, {
        status: 'approved',
      });
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      Alert.alert('Success', 'Event approved');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to approve event');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (eventId: string) => {
    Alert.alert(
      'Reject Event',
      'Are you sure you want to reject this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessingId(eventId);
              await FirestoreService.updateDocument('events', eventId, {
                status: 'rejected',
              });
              setEvents((prev) => prev.filter((e) => e.id !== eventId));
              Alert.alert('Success', 'Event rejected');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to reject event');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <View style={styles.eventContainer}>
      <EventCard
        event={item}
        onPress={() => {}}
      />
      <View style={styles.actions}>
        <Button
          title="Approve"
          onPress={() => handleApprove(item.id)}
          variant="primary"
          size="md"
          style={styles.actionButton}
          loading={processingId === item.id}
        />
        <Button
          title="Reject"
          onPress={() => handleReject(item.id)}
          variant="destructive"
          size="md"
          style={styles.actionButton}
          disabled={processingId === item.id}
        />
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {events.length > 0 ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          icon={<Calendar size={64} color="#9CA3AF" />}
          title="No pending events"
          description="All events have been reviewed"
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
  listContent: {
    padding: 24,
  },
  eventContainer: {
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
});

