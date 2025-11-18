// src/screens/onboarding/CompleteScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/types';
import { useAppStore } from '@/store/appStore';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Complete'>;

export default function CompleteScreen({ navigation }: Props) {
  const { setOnboarded } = useAppStore();

  const handleGetStarted = () => {
    setOnboarded(true);
    // Navigation will happen automatically via RootNavigator
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.delay(200).duration(600)}
        style={styles.content}
      >
        <CheckCircle size={100} color="#10B981" strokeWidth={2} />
        
        <Text style={styles.title}>You're All Set! 🎉</Text>
        
        <Text style={styles.subtitle}>
          Welcome to CampusFlow. Let's help you organize your student life and
          connect with your campus community.
        </Text>

        <View style={styles.features}>
          <FeatureItem
            emoji="📚"
            title="Stay Organized"
            description="Track tasks and deadlines with ease"
          />
          <FeatureItem
            emoji="🎉"
            title="Discover Events"
            description="Find and attend campus events"
          />
          <FeatureItem
            emoji="👥"
            title="Connect"
            description="Meet study buddies and join groups"
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={SlideInDown.delay(400).duration(400)}
        style={styles.actions}
      >
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          size="lg"
          fullWidth
        />
      </Animated.View>
    </View>
  );
}

function FeatureItem({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <View style={featureStyles.container}>
      <Text style={featureStyles.emoji}>{emoji}</Text>
      <View style={featureStyles.content}>
        <Text style={featureStyles.title}>{title}</Text>
        <Text style={featureStyles.description}>{description}</Text>
      </View>
    </View>
  );
}

const featureStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    paddingHorizontal: 8,
  },
  actions: {
    paddingTop: 16,
  },
});