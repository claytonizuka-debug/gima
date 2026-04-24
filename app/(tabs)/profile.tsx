import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GimaColors } from '@/constants/gimaTheme';
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
          Manage your Gima account and keep track of your island activity.
        </Text>
      </View>

      <View style={styles.card}>
        {user ? (
          <>
            <Text style={styles.label}>Signed in as</Text>
            <Text style={styles.email}>{user.email}</Text>

            <View style={styles.statCard}>
              <View>
                <Text style={styles.statLabel}>Saved places</Text>
                <Text style={styles.statHint}>Your personal island list</Text>
              </View>

              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{savedSlugs.length}</Text>
              </View>
            </View>

            <Pressable style={styles.primaryButton} onPress={handleLogout}>
              <Text style={styles.primaryButtonText}>Log Out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.label}>Guest mode</Text>
            <Text style={styles.email}>You are not logged in.</Text>

            <Text style={styles.helperText}>
              Log in or create an account to save businesses and receive recommendations.
            </Text>

            <Pressable style={styles.primaryButton} onPress={() => router.push('/auth')}>
              <Text style={styles.primaryButtonText}>Log In / Sign Up</Text>
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
    backgroundColor: GimaColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: GimaColors.mutedText,
  },
  container: {
    flex: 1,
    backgroundColor: GimaColors.background,
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
    color: GimaColors.mutedText,
    marginBottom: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GimaColors.mutedText,
    lineHeight: 24,
  },

  card: {
    backgroundColor: GimaColors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: GimaColors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: GimaColors.mutedText,
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: '800',
    color: GimaColors.ocean,
    marginBottom: 18,
  },
  helperText: {
    fontSize: 15,
    lineHeight: 22,
    color: GimaColors.mutedText,
    marginBottom: 20,
  },

  statCard: {
    backgroundColor: GimaColors.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: GimaColors.border,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: GimaColors.text,
    marginBottom: 3,
  },
  statHint: {
    fontSize: 13,
    color: GimaColors.mutedText,
  },

  countPill: {
    backgroundColor: GimaColors.coral,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 13,
    fontWeight: '900',
    color: GimaColors.text,
  },

  primaryButton: {
    backgroundColor: GimaColors.ocean,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});