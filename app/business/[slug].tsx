import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useSavedBusinesses } from '@/context/SavedBusinessesContext';

import { getBusinessBySlug, type Business } from '../../services/businessService';
import { sendRecommendation } from '../../services/recommendationService';
import { getUserByEmail } from '../../services/userService';

export default function BusinessDetailScreen() {
  const params = useLocalSearchParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { user } = useAuth();
  const { toggleSaved, isSaved, loading: savedLoading } = useSavedBusinesses();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusiness() {
      if (!slug) {
        setBusiness(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getBusinessBySlug(slug);
        setBusiness(data);
      } catch (error) {
        console.error('Error loading business:', error);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading business...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Business not found</Text>
      </View>
    );
  }

  const businessSlug = business.slug;
  const saved = isSaved(businessSlug);

  async function handleSavePress() {
    if (!user) {
      Alert.alert(
        'Login required',
        'Please log in to save businesses.',
        [{ text: 'Go to Login', onPress: () => router.push('/auth') }]
      );
      return;
    }

    await toggleSaved(businessSlug);
  }

  async function handleRecommendPress() {
    if (!user || !user.email) {
      Alert.alert(
        'Login required',
        'Please log in to send recommendations.',
        [{ text: 'Go to Login', onPress: () => router.push('/auth') }]
      );
      return;
    }

    // ✅ FIX: store safe email
    const fromEmail = user.email;

    Alert.prompt(
      'Send Recommendation',
      'Enter the email of the person you want to recommend this to:',
      async (email) => {
        if (!email) return;

        try {
          const targetUser = await getUserByEmail(email);

          if (!targetUser) {
            Alert.alert('User not found', 'No account exists with that email.');
            return;
          }

          await sendRecommendation({
            toUserId: targetUser.uid,
            businessSlug,
            fromUserId: user.uid,
            fromEmail: fromEmail, // ✅ no more error
          });

          Alert.alert('Success', 'Recommendation sent!');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to send recommendation.');
        }
      }
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Image source={{ uri: business.image }} style={styles.image} />

      <Text style={styles.title}>{business.name}</Text>
      <Text style={styles.description}>{business.description}</Text>

      <Pressable
        style={[styles.button, saved && styles.savedButton]}
        onPress={handleSavePress}
        disabled={savedLoading}
      >
        <Text style={styles.buttonText}>
          {saved ? 'Saved' : 'Save Business'}
        </Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleRecommendPress}>
        <Text style={styles.secondaryButtonText}>Recommend</Text>
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Hours</Text>
        <Text>{business.hours}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Location</Text>
        <Text>{business.location}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f4' },
  contentContainer: { padding: 20 },
  image: { width: '100%', height: 240, borderRadius: 20, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginBottom: 16 },

  button: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  savedButton: {
    backgroundColor: '#0a7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontWeight: '700',
    color: '#111',
  },

  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  label: {
    fontWeight: '700',
    marginBottom: 4,
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#777' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
});