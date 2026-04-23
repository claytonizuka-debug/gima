import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useSavedBusinesses } from '@/context/SavedBusinessesContext';
import { logOut } from '../../services/authService';

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const { savedSlugs } = useSavedBusinesses();

  async function handleLogout() {
    await logOut();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>ACCOUNT</Text>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Manage your account and keep track of your activity in Gima.
        </Text>
      </View>

      <View style={styles.card}>
        {user ? (
          <>
            <Text style={styles.sectionLabel}>Signed in as</Text>
            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Saved places</Text>
              <Text style={styles.statValue}>{savedSlugs.length}</Text>
            </View>

            <Pressable style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Guest mode</Text>
            <Text style={styles.email}>You are not logged in.</Text>

            <Text style={styles.helperText}>
              Log in or create an account to save businesses across devices.
            </Text>

            <Pressable style={styles.button} onPress={() => router.push('/auth')}>
              <Text style={styles.buttonText}>Log In / Sign Up</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f7f7f4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#77776f',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f4',
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  hero: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#6b6b63',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5f5f58',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#6b6b63',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 18,
  },
  helperText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 15,
    color: '#5f5f58',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});