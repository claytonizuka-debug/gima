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

import { GimaColors } from '@/constants/gimaTheme';
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
  const [message, setMessage] = useState('');
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

  const safeBusiness = business;
  const businessSlug = safeBusiness.slug;
  const saved = isSaved(businessSlug);

  async function handleSave() {
    if (!user) {
      router.push('/auth');
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
    setMessage('');
    setRecommendModalVisible(true);
  }

  async function handleSend() {
    if (!user || !user.email) return;

    const fromEmail = user.email;
    const cleanEmail = recipientEmail.trim().toLowerCase();
    const cleanMessage = message.trim();

    if (!cleanEmail) {
      Alert.alert('Missing email', 'Please enter an email.');
      return;
    }

    if (cleanEmail === fromEmail.toLowerCase()) {
      Alert.alert('Invalid', 'You cannot recommend a business to yourself.');
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
        fromEmail,
        message: cleanMessage,
      });

      setRecommendModalVisible(false);
      setRecipientEmail('');
      setMessage('');

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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: safeBusiness.image }} style={styles.image} />

        <Text style={styles.title}>{safeBusiness.name}</Text>
        <Text style={styles.description}>{safeBusiness.description}</Text>

        <Pressable
          style={[styles.primaryButton, saved && styles.savedButton]}
          onPress={handleSave}
          disabled={savedLoading}
        >
          <Text style={styles.primaryButtonText}>
            {saved ? 'Saved' : 'Save Business'}
          </Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleOpenRecommendModal}>
          <Text style={styles.secondaryButtonText}>Recommend</Text>
        </Pressable>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Hours</Text>
          <Text style={styles.infoText}>{safeBusiness.hours}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.infoText}>{safeBusiness.location}</Text>
        </View>
      </ScrollView>

      <Modal visible={recommendModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recommend {safeBusiness.name}</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={GimaColors.mutedText}
              value={recipientEmail}
              onChangeText={setRecipientEmail}
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message (optional)"
              placeholderTextColor={GimaColors.mutedText}
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <Pressable
              style={styles.modalPrimaryButton}
              onPress={handleSend}
              disabled={sendingRecommendation}
            >
              <Text style={styles.modalPrimaryButtonText}>
                {sendingRecommendation ? 'Sending...' : 'Send'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setRecommendModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GimaColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: GimaColors.mutedText,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: GimaColors.ocean,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  savedButton: {
    backgroundColor: GimaColors.leaf,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: GimaColors.card,
    borderWidth: 1.5,
    borderColor: GimaColors.coral,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: GimaColors.text,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: GimaColors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: GimaColors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: GimaColors.mutedText,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 15,
    color: GimaColors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: GimaColors.card,
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: GimaColors.ocean,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: GimaColors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalPrimaryButton: {
    backgroundColor: GimaColors.ocean,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPrimaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 10,
  },
  cancelButtonText: {
    color: GimaColors.mutedText,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GimaColors.background,
  },
  loadingText: {
    color: GimaColors.mutedText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GimaColors.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: GimaColors.ocean,
  },
  emptyText: {
    color: GimaColors.mutedText,
  },
});