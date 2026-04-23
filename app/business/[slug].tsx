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
        <Text style={styles.emptyText}>
          We could not find information for this business.
        </Text>
      </View>
    );
  }

  const businessSlug = business.slug;
  const saved = isSaved(businessSlug);

  async function handleSavePress() {
    if (!user) {
      Alert.alert(
        'Login required',
        'Please log in or create an account to save businesses.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Login', onPress: () => router.push('/auth') },
        ]
      );
      return;
    }

    await toggleSaved(businessSlug);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: business.image }} style={styles.image} />

      <View style={styles.headerBlock}>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{business.category}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{business.status}</Text>
          </View>
        </View>

        <Text style={styles.title}>{business.name}</Text>
        <Text style={styles.description}>{business.description}</Text>
      </View>

      <Pressable
        style={[styles.saveButton, saved && styles.savedButton]}
        onPress={handleSavePress}
        disabled={savedLoading}
      >
        <Text style={[styles.saveButtonText, saved && styles.savedButtonText]}>
          {saved ? 'Saved' : 'Save Business'}
        </Text>
      </Pressable>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Business Info</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Hours</Text>
          <Text style={styles.infoText}>{business.hours}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoText}>{business.location}</Text>
        </View>
      </View>
    </ScrollView>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f7f7f4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f4',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 24,
    marginBottom: 22,
  },
  headerBlock: {
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#6b6b63',
    textTransform: 'uppercase',
  },
  statusPill: {
    backgroundColor: '#e9f7ef',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#198754',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    color: '#5f5f58',
  },
  saveButton: {
    backgroundColor: '#111',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  savedButton: {
    backgroundColor: '#e9f7ef',
    borderWidth: 1,
    borderColor: '#cfead8',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  savedButtonText: {
    color: '#198754',
  },
  infoSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6b6b63',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111',
  },
});