// src/components/ui/Input.tsx

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  containerStyle,
  isPassword = false,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});