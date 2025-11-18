// src/components/cards/EventCard.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Event, RSVPStatus } from '@/types';
import { Calendar, MapPin, Users, Link as LinkIcon } from 'lucide-react-native';
import { format } from 'date-fns';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onRSVP?: (status: RSVPStatus) => void;
  userRSVP?: RSVPStatus;
}

export default function EventCard({ event, onPress, onRSVP, userRSVP }: EventCardProps) {
  const startDate = event.startsAt.toDate();

  const getCategoryColor = (): any => {
    switch (event.category) {
      case 'social': return 'primary';
      case 'study': return 'info';
      case 'sports': return 'success';
      case 'culture': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      {event.coverUrl && (
        <Image source={{ uri: event.coverUrl }} style={styles.cover} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Badge label={event.category} variant={getCategoryColor()} />
          {event.featured && (
            <Badge label="Featured" variant="warning" style={styles.featuredBadge} />
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={styles.host} numberOfLines={1}>
          by {event.hostName}
        </Text>

        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {format(startDate, 'EEE, MMM d • h:mm a')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            {event.location.type === 'physical' ? (
              <MapPin size={16} color="#6B7280" />
            ) : (
              <LinkIcon size={16} color="#6B7280" />
            )}
            <Text style={styles.infoText} numberOfLines={1}>
              {event.location.value}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Users size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {event.attendeeCount + event.interestedCount} interested
            </Text>
          </View>
        </View>

        {onRSVP && (
          <View style={styles.rsvpButtons}>
            <TouchableOpacity
              style={[
                styles.rsvpButton,
                userRSVP === 'going' && styles.rsvpButtonActive,
              ]}
              onPress={() => onRSVP('going')}
            >
              <Text
                style={[
                  styles.rsvpButtonText,
                  userRSVP === 'going' && styles.rsvpButtonTextActive,
                ]}
              >
                Going
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.rsvpButton,
                userRSVP === 'interested' && styles.rsvpButtonActive,
              ]}
              onPress={() => onRSVP('interested')}
            >
              <Text
                style={[
                  styles.rsvpButtonText,
                  userRSVP === 'interested' && styles.rsvpButtonTextActive,
                ]}
              >
                Interested
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredBadge: {
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  host: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  info: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  rsvpButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  rsvpButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rsvpButtonActive: {
    backgroundColor: '#3B82F6',
  },
  rsvpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  rsvpButtonTextActive: {
    color: '#FFFFFF',
  },
});
