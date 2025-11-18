// src/screens/profile/admin/ReportsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { Report, User } from '@/types';
import { where } from 'firebase/firestore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Flag, AlertCircle } from 'lucide-react-native';
import { format } from 'date-fns';

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [reporters, setReporters] = useState<Map<string, User>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const constraints = [where('status', '==', 'open')];
      const openReports = await FirestoreService.getDocuments<Report>('reports', constraints);
      setReports(openReports);

      // Load reporter data
      const reporterIds = new Set(openReports.map((r) => r.reporterId));
      const usersMap = new Map<string, User>();
      
      for (const userId of reporterIds) {
        const userData = await FirestoreService.getDocument<User>('users', userId);
        if (userData) usersMap.set(userId, userData);
      }
      
      setReporters(usersMap);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const handleResolve = async (reportId: string) => {
    Alert.alert(
      'Resolve Report',
      'Choose an action:',
      [
        {
          text: 'Dismiss',
          onPress: async () => {
            await updateReportStatus(reportId, 'No action taken');
          },
        },
        {
          text: 'Warn User',
          onPress: async () => {
            await updateReportStatus(reportId, 'User warned');
          },
        },
        {
          text: 'Remove Content',
          style: 'destructive',
          onPress: async () => {
            await updateReportStatus(reportId, 'Content removed');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const updateReportStatus = async (reportId: string, action: string) => {
    try {
      setProcessingId(reportId);
      await FirestoreService.updateDocument('reports', reportId, {
        status: 'reviewed',
        action,
        reviewedAt: new Date(),
      });
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      Alert.alert('Success', 'Report resolved');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resolve report');
    } finally {
      setProcessingId(null);
    }
  };

  const renderReport = ({ item }: { item: Report }) => {
    const reporter = reporters.get(item.reporterId);
    
    return (
      <Card style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Badge
            label={item.target.type}
            variant="warning"
          />
          <Text style={styles.reportDate}>
            {format(item.createdAt.toDate(), 'MMM d, h:mm a')}
          </Text>
        </View>

        <Text style={styles.reportReason}>{item.reason}</Text>

        <View style={styles.reportMeta}>
          <Text style={styles.reportMetaText}>
            Reported by: {reporter?.name || 'Unknown'}
          </Text>
          <Text style={styles.reportMetaText}>
            Target ID: {item.target.id.substring(0, 8)}...
          </Text>
        </View>

        <Button
          title="Resolve"
          onPress={() => handleResolve(item.id)}
          variant="secondary"
          size="md"
          fullWidth
          loading={processingId === item.id}
          style={styles.resolveButton}
        />
      </Card>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {reports.length > 0 ? (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          icon={<Flag size={64} color="#9CA3AF" />}
          title="No open reports"
          description="All reports have been reviewed"
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
  reportCard: {
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reportReason: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    lineHeight: 24,
  },
  reportMeta: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
  },
  reportMetaText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  resolveButton: {
    marginTop: 4,
  },
});

