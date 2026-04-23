import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { logOut } from '../../services/authService';

export default function ProfileScreen() {
  const { user, loading } = useAuth();

  async function handleLogout() {
    await logOut();
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user ? (
        <>
          <Text style={styles.email}>{user.email}</Text>

          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.email}>You are not logged in.</Text>

          <Pressable style={styles.button} onPress={() => router.push('/auth')}>
            <Text style={styles.buttonText}>Log In / Sign Up</Text>
          </Pressable>
        </>
      )}
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
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});