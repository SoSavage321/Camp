// src/screens/social/SocialMainScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEventStore } from '@/store/eventStore';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Plus, Search } from 'lucide-react-native';
import EventCard from '@/components/cards/EventCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Chip from '@/components/ui/Chip';
import { EventCategory } from '@/types';

const Tab = createMaterialTopTabNavigator();

export default function SocialMainScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {/* TODO: Implement search */}}
          >
            <Search size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateEvent')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#6B7280',
          tabBarIndicatorStyle: {
            backgroundColor: '#3B82F6',
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          },
        }}
      >
        <Tab.Screen name="Events" component={EventsTab} />
        <Tab.Screen name="Groups" component={GroupsTab} />
        <Tab.Screen name="Buddies" component={BuddiesTab} />
      </Tab.Navigator>
    </View>
  );
}
// ==========================================
// Events Tab
function EventsTab() {
  const navigation = useNavigation<any>();
  const { events, myRSVPs, fetchEvents, fetchMyRSVPs, rsvpToEvent, isLoading } = useEventStore();

  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchEvents(), fetchMyRSVPs()]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const myRSVPMap = new Map(myRSVPs.map((rsvp) => [rsvp.eventId, rsvp.status]));

  const filteredEvents = events.filter((event) => {
    if (selectedCategory === 'all') return true;
    return event.category === selectedCategory;
  });

  const categories: Array<EventCategory | 'all'> = [
    'all',
    'social',
    'study',
    'sports',
    'culture',
    'other',
  ];

  if (isLoading && events.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.tabContainer}>
      {/* Category Filters */}
      <View style={styles.filters}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </View>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
              onRSVP={(status) => rsvpToEvent(item.id, status)}
              userRSVP={myRSVPMap.get(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          title="No events found"
          description="Be the first to create an event"
          actionLabel="Create Event"
          onAction={() => navigation.navigate('CreateEvent')}
        />
      )}
    </View>
  );
}

// ==========================================
// Groups Tab
function GroupsTab() {
  const navigation = useNavigation<any>();

  // TODO: Implement group store
  const groups: any[] = [];
  const isLoading = false;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.tabContainer}>
      <EmptyState
        title="Groups Coming Soon"
        description="Join societies and study groups to connect with peers"
      />
    </View>
  );
}

// ==========================================
// Buddies Tab
function BuddiesTab() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.tabContainer}>
      <View style={styles.buddiesContent}>
        <Text style={styles.buddiesTitle}>Find Study Buddies</Text>
        <Text style={styles.buddiesDescription}>
          Connect with students in your courses and discover study partners
        </Text>
        <TouchableOpacity
          style={styles.buddiesButton}
          onPress={() => navigation.navigate('StudyBuddies')}
        >
          <Text style={styles.buddiesButtonText}>Find Buddies</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
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
  buddiesContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  buddiesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  buddiesDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buddiesButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buddiesButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});