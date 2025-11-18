// src/screens/social/EventDetailScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SocialStackParamList } from '@/navigation/types';
import { useEventStore } from '@/store/eventStore';
import { useAuthStore } from '@/store/authStore';
import { FirestoreService } from '@/services/firebase/firestore.service';
import { Event, RSVPStatus } from '@/types';
import {
  Calendar,
  MapPin,
  Users,
  Link as LinkIcon,
  Share2,
  MessageCircle,
  Edit,
  Trash2,
} from 'lucide-react-native';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Props = NativeStackScreenProps<SocialStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const { user } = useAuthStore();
  const { myRSVPs, rsvpToEvent, removeRSVP, deleteEvent } = useEventStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      const eventData = await FirestoreService.getDocument<Event>('events', eventId);
      setEvent(eventData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load event');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const userRSVP = myRSVPs.find((r) => r.eventId === eventId);

  const handleRSVP = async (status: RSVPStatus) => {
    try {
      if (userRSVP?.status === status) {
        await removeRSVP(eventId);
      } else {
        await rsvpToEvent(eventId, status);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to RSVP');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event?.title}`,
        // TODO: Add deep link
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const isHost = user?.id === event?.hostId;
  const canEdit = isHost || user?.roles.admin;

  if (isLoading || !event) {
    return <LoadingSpinner />;
  }

  const startDate = event.startsAt.toDate();
  const endDate = event.endsAt.toDate();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Cover Image */}
        {event.coverUrl ? (
          <Image source={{ uri: event.coverUrl }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]} />
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Badge
              label={event.category}
              variant={event.category === 'social' ? 'primary' : 'success'}
            />
            {event.featured && (
              <Badge label="Featured" variant="warning" style={styles.featuredBadge} />
            )}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.host}>by {event.hostName}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Calendar size={20} color="#3B82F6" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>When</Text>
              <Text style={styles.infoValue}>
                {format(startDate, 'EEE, MMM d • h:mm a')}
              </Text>
              <Text style={styles.infoSubtext}>
                Until {format(endDate, 'h:mm a')}
              </Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            {event.location.type === 'physical' ? (
              <MapPin size={20} color="#10B981" />
            ) : (
              <LinkIcon size={20} color="#10B981" />
            )}
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>
                {event.location.type === 'physical' ? 'Where' : 'Link'}
              </Text>
              <Text style={styles.infoValue}>{event.location.value}</Text>
            </View>
          </Card>

          <Card style={styles.infoCard}>
            <Users size={20} color="#F59E0B" />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Attendees</Text>
              <Text style={styles.infoValue}>
                {event.attendeeCount + event.interestedCount} interested
              </Text>
              {event.capacity && (
                <Text style={styles.infoSubtext}>
                  Capacity: {event.capacity}
                </Text>
              )}
            </View>
          </Card>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Action Buttons */}
        {canEdit && (
          <View style={styles.adminActions}>
            <Button
              title="Edit Event"
              onPress={() => navigation.navigate('EditEvent', { eventId })}
              variant="secondary"
              size="md"
              style={styles.adminButton}
            />
            <Button
              title="Delete"
              onPress={handleDelete}
              variant="destructive"
              size="md"
              style={styles.adminButton}
            />
          </View>
        )}
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.rsvpButtons}>
          <TouchableOpacity
            style={[
              styles.rsvpButton,
              userRSVP?.status === 'going' && styles.rsvpButtonActive,
            ]}
            onPress={() => handleRSVP('going')}
          >
            <Text
              style={[
                styles.rsvpButtonText,
                userRSVP?.status === 'going' && styles.rsvpButtonTextActive,
              ]}
            >
              {userRSVP?.status === 'going' ? '✓ Going' : 'Going'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rsvpButton,
              userRSVP?.status === 'interested' && styles.rsvpButtonActive,
            ]}
            onPress={() => handleRSVP('interested')}
          >
            <Text
              style={[
                styles.rsvpButtonText,
                userRSVP?.status === 'interested' && styles.rsvpButtonTextActive,
              ]}
            >
              {userRSVP?.status === 'interested' ? '✓ Interested' : 'Interested'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.iconAction} onPress={handleShare}>
            <Share2 size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconAction}
            onPress={() => {/* TODO: Open event chat */}}
          >
            <MessageCircle size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 240,
    backgroundColor: '#F3F4F6',
  },
  coverPlaceholder: {
    backgroundColor: '#E5E7EB',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredBadge: {
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  host: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoSection: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  adminButton: {
    flex: 1,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  rsvpButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rsvpButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rsvpButtonActive: {
    backgroundColor: '#3B82F6',
  },
  rsvpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  rsvpButtonTextActive: {
    color: '#FFFFFF',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  iconAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});