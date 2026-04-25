import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GimaColors } from '@/constants/gimaTheme';
import { useAuth } from '@/context/AuthContext';
import { logIn, signUp } from '../services/authService';

export default function AuthScreen() {
  const { user, loading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  if (loading) return null;

  async function handleSubmit() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      Alert.alert('Missing info', 'Please enter both email and password.');
      return;
    }

    try {
      if (isLoginMode) {
        await logIn(cleanEmail, password);
      } else {
        await signUp(cleanEmail, password);
      }

      router.replace('/');
    } catch (error: any) {
      Alert.alert('Auth Error', error.message || 'Something went wrong.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>GIMA ACCOUNT</Text>

          <Text style={styles.title}>
            {isLoginMode ? 'Welcome back' : 'Join Gima'}
          </Text>

          <Text style={styles.subtitle}>
            {isLoginMode
              ? 'Log in to save places and receive island recommendations.'
              : 'Create an account to save local spots and share recommendations.'}
          </Text>
        </View>

        <View style={styles.card}>
          {/* Toggle */}
          <View style={styles.modeRow}>
            <Pressable
              style={[
                styles.modeButton,
                isLoginMode && styles.activeModeButton,
              ]}
              onPress={() => setIsLoginMode(true)}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  isLoginMode && styles.activeModeButtonText,
                ]}
              >
                Log In
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                !isLoginMode && styles.activeModeButton,
              ]}
              onPress={() => setIsLoginMode(false)}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  !isLoginMode && styles.activeModeButtonText,
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={GimaColors.mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor={GimaColors.mutedText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Coral button */}
          <Pressable style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>
              {isLoginMode ? 'Log In' : 'Create Account'}
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: GimaColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: GimaColors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 92,
    paddingBottom: 32,
  },

  hero: {
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: GimaColors.mutedText,
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: GimaColors.mutedText,
  },

  card: {
    backgroundColor: GimaColors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: GimaColors.border,
  },

  modeRow: {
    flexDirection: 'row',
    backgroundColor: GimaColors.background,
    borderRadius: 16,
    padding: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: GimaColors.border,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },

  // ocean-light toggle
  activeModeButton: {
    backgroundColor: GimaColors.oceanLight,
    borderWidth: 1,
    borderColor: GimaColors.ocean,
  },

  modeButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: GimaColors.mutedText,
  },
  activeModeButtonText: {
    color: GimaColors.ocean,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: GimaColors.mutedText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: GimaColors.background,
    borderWidth: 1,
    borderColor: GimaColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: GimaColors.text,
    marginBottom: 14,
  },

  primaryButton: {
    backgroundColor: GimaColors.coral,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 22,
  },
  backButtonText: {
    color: GimaColors.mutedText,
    fontSize: 15,
    fontWeight: '700',
  },
});