import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { logIn, signUp } from '../services/authService';

export default function AuthScreen() {
  const { user, loading } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ FIX: Move navigation into useEffect
  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  // Optional: prevent flicker while auth state loads
  if (loading) {
    return null;
  }

  async function handleSubmit() {
    try {
      if (isLoginMode) {
        await logIn(email, password);
        Alert.alert('Success', 'Logged in successfully');
      } else {
        await signUp(email, password);
        Alert.alert('Success', 'Account created successfully');
      }

      router.replace('/');
    } catch (error: any) {
      Alert.alert('Auth Error', error.message || 'Something went wrong');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLoginMode ? 'Log In' : 'Sign Up'}</Text>
      <Text style={styles.subtitle}>Welcome to Gima</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isLoginMode ? 'Log In' : 'Create Account'}
        </Text>
      </Pressable>

      <Pressable onPress={() => setIsLoginMode(!isLoginMode)}>
        <Text style={styles.switchText}>
          {isLoginMode
            ? 'Need an account? Sign up'
            : 'Already have an account? Log in'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    color: '#444',
    fontSize: 15,
  },
});