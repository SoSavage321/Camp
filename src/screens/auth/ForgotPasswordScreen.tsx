// src/screens/auth/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import { AuthService } from '@/services/firebase/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail } from 'lucide-react-native';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      await AuthService.resetPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContent}>
          <Mail size={64} color="#10B981" strokeWidth={2} />
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successMessage}>
            We've sent password reset instructions to {email}
          </Text>
          <Button
            title="Back to Sign In"
            onPress={() => navigation.navigate('SignIn')}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Mail size={48} color="#3B82F6" strokeWidth={2} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you instructions to reset your password
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="your.email@university.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <Button
            title="Send Reset Link"
            onPress={handleResetPassword}
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
          />
        </View>

        <Button
          title="Back to Sign In"
          onPress={() => navigation.navigate('SignIn')}
          variant="tertiary"
          size="md"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  form: {
    marginBottom: 24,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    minWidth: 200,
  },
});