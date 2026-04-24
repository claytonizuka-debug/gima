import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

  const [recommendModalVisible, setRecommendModalVisible] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendingRecommendation, setSendingRecommendation] = useState(false);

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

  // ✅ FIX: create non-null reference for TypeScript
  const safeBusiness = business;

  const businessSlug = safeBusiness.slug;
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

  function handleOpenRecommendModal() {
    if (!user || !user.email) {
      Alert.alert(
        'Login required',
        'Please log in to send recommendations.',
        [{ text: 'Go to Login', onPress: () => router.push('/auth') }]
      );
      return;
    }

    setRecipientEmail('');
    setRecommendModalVisible(true);
  }

  async function handleSendRecommendation() {
    if (!user || !user.email) return;

    const cleanEmail = recipientEmail.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert('Missing email', 'Please enter an email.');
      return;
    }

    if (cleanEmail === user.email.toLowerCase()) {
      Alert.alert('Invalid', 'You cannot recommend to yourself.');
      return;
    }

    try {
      setSendingRecommendation(true);

      const targetUser = await getUserByEmail(cleanEmail);

      if (!targetUser) {
        Alert.alert('User not found', 'No account exists with that email.');
        return;
      }

      await sendRecommendation({
        toUserId: targetUser.uid,
        businessSlug,
        fromUserId: user.uid,
        fromEmail: user.email,
      });

      setRecommendModalVisible(false);
      setRecipientEmail('');

      // ✅ FIXED HERE
      Alert.alert(
        'Recommendation sent',
        `${safeBusiness.name} was sent to ${cleanEmail}.`
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send recommendation.');
    } finally {
      setSendingRecommendation(false);
    }
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: safeBusiness.image }} style={styles.image} />

        <Text style={styles.title}>{safeBusiness.name}</Text>
        <Text style={styles.description}>{safeBusiness.description}</Text>

        <Pressable
          style={[styles.saveButton, saved && styles.savedButton]}
          onPress={handleSavePress}
          disabled={savedLoading}
        >
          <Text style={styles.saveButtonText}>
            {saved ? 'Saved' : 'Save Business'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.recommendButton}
          onPress={handleOpenRecommendModal}
        >
          <Text style={styles.recommendButtonText}>
            Recommend to Someone
          </Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Hours</Text>
          <Text>{safeBusiness.hours}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Location</Text>
          <Text>{safeBusiness.location}</Text>
        </View>
      </ScrollView>

      <Modal visible={recommendModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Recommend {safeBusiness.name}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              placeholderTextColor="#999"
              value={recipientEmail}
              onChangeText={setRecipientEmail}
            />

            <Pressable
              style={styles.modalButton}
              onPress={handleSendRecommendation}
              disabled={sendingRecommendation}
            >
              <Text style={styles.modalButtonText}>
                {sendingRecommendation ? 'Sending...' : 'Send'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setRecommendModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f4' },
  contentContainer: { padding: 20 },
  image: { width: '100%', height: 240, borderRadius: 20, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginBottom: 16 },

  saveButton: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  savedButton: { backgroundColor: '#0a7' },
  saveButtonText: { color: '#fff', fontWeight: '700' },

  recommendButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recommendButtonText: { fontWeight: '700' },

  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  label: { fontWeight: '700', marginBottom: 4 },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: { color: '#fff', fontWeight: '700' },

  cancelButton: {
    alignItems: 'center',
    padding: 8,
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#777' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyText: { color: '#666' },
});