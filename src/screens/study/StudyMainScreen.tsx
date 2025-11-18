// src/screens/study/StudyMainScreen.tsx

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
import { useTaskStore } from '@/store/taskStore';
import { Plus, Filter, Calendar as CalendarIcon } from 'lucide-react-native';
import TaskCard from '@/components/cards/TaskCard';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Chip from '@/components/ui/Chip';

type FilterType = 'all' | 'today' | 'week' | 'overdue';

export default function StudyMainScreen() {
  const navigation = useNavigation<any>();
  const { tasks, fetchTasks, toggleTaskComplete, isLoading } = useTaskStore();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return !task.completed;
    
    const dueDate = task.dueAt.toDate();
    const now = new Date();

    if (activeFilter === 'today') {
      return (
        !task.completed &&
        dueDate.toDateString() === now.toDateString()
      );
    }

    if (activeFilter === 'week') {
      const weekFromNow = new Date(now);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return !task.completed && dueDate <= weekFromNow;
    }

    if (activeFilter === 'overdue') {
      return !task.completed && dueDate < now;
    }

    return true;
  });

  if (isLoading && tasks.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Study Planner</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <CalendarIcon size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TaskDetail', { mode: 'create' })}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <Chip
          label="All"
          selected={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
        <Chip
          label="Today"
          selected={activeFilter === 'today'}
          onPress={() => setActiveFilter('today')}
        />
        <Chip
          label="This Week"
          selected={activeFilter === 'week'}
          onPress={() => setActiveFilter('week')}
        />
        <Chip
          label="Overdue"
          selected={activeFilter === 'overdue'}
          onPress={() => setActiveFilter('overdue')}
        />
      </View>

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => navigation.navigate('TaskDetail', {
                taskId: item.id,
                mode: 'edit'
              })}
              onToggle={() => toggleTaskComplete(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          icon={<CalendarIcon size={64} color="#9CA3AF" />}
          title="No tasks found"
          description="Start planning your study sessions"
          actionLabel="Add your first task"
          onAction={() => navigation.navigate('TaskDetail', { mode: 'create' })}
        />
      )}

      {/* Cram Mode FAB */}
      <TouchableOpacity
        style={styles.cramFab}
        onPress={() => navigation.navigate('CramMode')}
      >
        <Text style={styles.cramFabText}>🔥 Cram Mode</Text>
      </TouchableOpacity>
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
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 24,
  },
  cramFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cramFabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});