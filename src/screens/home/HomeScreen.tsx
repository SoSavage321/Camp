// src/screens/home/HomeScreen.tsx

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { useEventStore } from '@/store/eventStore';
import { Task, Event } from '@/types';
import {
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
} from 'lucide-react-native';
import { format, isToday, isTomorrow, addDays, startOfDay, endOfDay } from 'date-fns';
import TaskCard from '@/components/cards/TaskCard';
import EventCard from '@/components/cards/EventCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { tasks, fetchTasks, toggleTaskComplete, isLoading: tasksLoading } = useTaskStore();
  const { events, myRSVPs, fetchEvents, fetchMyRSVPs, rsvpToEvent, isLoading: eventsLoading } = useEventStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        fetchTasks(),
        fetchEvents(),
        fetchMyRSVPs(),
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Memoize filtered tasks to prevent re-calculation on every render
  const todaysTasks = useMemo(() => {
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    return tasks
      .filter((task) => {
        if (task.completed) return false;
        const dueDate = task.dueAt.toDate();
        return dueDate >= startOfDay(today) && dueDate <= endOfDay(threeDaysFromNow);
      })
      .slice(0, 5);
  }, [tasks]);

  // Memoize filtered events to prevent re-calculation on every render
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    return events
      .filter((event) => {
        const eventDate = event.startsAt.toDate();
        return eventDate >= today && eventDate <= threeDaysFromNow;
      })
      .slice(0, 5);
  }, [events]);

  // Memoize RSVP map for quick lookups
  const myRSVPMap = useMemo(
    () => new Map(myRSVPs.map((rsvp) => [rsvp.eventId, rsvp.status])),
    [myRSVPs]
  );

  // Memoize stats to prevent re-calculation on every render
  const { completedToday, totalToday, completionRate } = useMemo(() => {
    const todaysTasks = tasks.filter((task) => isToday(task.dueAt.toDate()));
    const completed = todaysTasks.filter((task) => task.completed).length;
    const total = todaysTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedToday: completed, totalToday: total, completionRate: rate };
  }, [tasks]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Show loading spinner on initial load while fetching data
  if ((tasksLoading || eventsLoading) && tasks.length === 0 && events.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}, {user?.name?.split(' ')[0]}!</Text>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('ProfileTab', { screen: 'Notifications' })}
        >
          <Bell size={24} color="#111827" />
          {/* TODO: Add notification badge */}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        {totalToday > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <TrendingUp size={20} color="#10B981" />
                <Text style={styles.statValue}>{completionRate}%</Text>
                <Text style={styles.statLabel}>Completed Today</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Clock size={20} color="#F59E0B" />
                <Text style={styles.statValue}>{totalToday - completedToday}</Text>
                <Text style={styles.statLabel}>Tasks Remaining</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickActionButton
            icon={<Plus size={20} color="#FFFFFF" />}
            label="Add Task"
            onPress={() => navigation.navigate('StudyTab', {
              screen: 'TaskDetail',
              params: { mode: 'create' }
            })}
            color="#3B82F6"
          />
          <QuickActionButton
            icon={<Calendar size={20} color="#FFFFFF" />}
            label="New Event"
            onPress={() => navigation.navigate('SocialTab', { screen: 'CreateEvent' })}
            color="#10B981"
          />
          <QuickActionButton
            icon={<Clock size={20} color="#FFFFFF" />}
            label="Cram Mode"
            onPress={() => navigation.navigate('StudyTab', { screen: 'CramMode' })}
            color="#F59E0B"
          />
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('StudyTab', { screen: 'StudyMain' })}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {todaysTasks.length > 0 ? (
            <View style={styles.list}>
              {todaysTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => navigation.navigate('StudyTab', {
                    screen: 'TaskDetail',
                    params: { taskId: task.id, mode: 'edit' }
                  })}
                  onToggle={() => toggleTaskComplete(task.id)}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<Clock size={48} color="#9CA3AF" />}
              title="Nothing due soon"
              description="Future you is proud. 🎉"
              actionLabel="Add a task"
              onAction={() => navigation.navigate('StudyTab', {
                screen: 'TaskDetail',
                params: { mode: 'create' }
              })}
            />
          )}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SocialTab', { screen: 'SocialMain' })}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {upcomingEvents.length > 0 ? (
            <View style={styles.list}>
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => navigation.navigate('SocialTab', {
                    screen: 'EventDetail',
                    params: { eventId: event.id }
                  })}
                  onRSVP={(status) => rsvpToEvent(event.id, status)}
                  userRSVP={myRSVPMap.get(event.id)}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<Calendar size={48} color="#9CA3AF" />}
              title="Quiet day on campus"
              description="Explore what's happening."
              actionLabel="Discover events"
              onAction={() => navigation.navigate('SocialTab', { screen: 'SocialMain' })}
            />
          )}
        </View>

        {/* Study Tip Card */}
        <Card style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Study Tip</Text>
          <Text style={styles.tipText}>
            Try the Pomodoro technique: Focus for 25 minutes, then take a 5-minute break.
            Use Cram Mode to stay on track!
          </Text>
          <Button
            title="Start Cramming"
            onPress={() => navigation.navigate('StudyTab', { screen: 'CramMode' })}
            variant="primary"
            size="sm"
            style={styles.tipButton}
          />
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

function QuickActionButton({
  icon,
  label,
  onPress,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
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
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  list: {
    gap: 0,
  },
  tipCard: {
    marginBottom: 24,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipButton: {
    alignSelf: 'flex-start',
  },
  bottomPadding: {
    height: 32,
  },
});