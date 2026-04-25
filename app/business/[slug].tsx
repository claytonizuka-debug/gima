import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
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

  function handleOpenMaps() {
    const destination = encodeURIComponent(
      `${safeBusiness.name} ${safeBusiness.location} Saipan CNMI`
    );

    Alert.alert('Open Maps', 'Choose an app', [
      {
        text: 'Apple Maps',
        onPress: () => {
          Linking.openURL(`http://maps.apple.com/?q=${destination}`);
        },
      },
      {
        text: 'Google Maps',
        onPress: () => {
          Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${destination}`
          );
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
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

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.saveButton, saved && styles.savedButton]}
            onPress={handleSave}
            disabled={savedLoading}
          >
            <Text style={styles.saveButtonText}>
              {saved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.recommendButton}
            onPress={handleOpenRecommendModal}
          >
            <Text style={styles.recommendButtonText}>Recommend</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Hours</Text>
          <Text style={styles.infoText}>{safeBusiness.hours}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.infoText}>{safeBusiness.location}</Text>

          <Pressable style={styles.directionsButton} onPress={handleOpenMaps}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={recommendModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recommend {safeBusiness.name}</Text>
            <Text style={styles.modalSubtitle}>
              Send this place to another Gima user.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={GimaColors.mutedText}
              autoCapitalize="none"
              keyboardType="email-address"
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
              style={[styles.modalPrimaryButton, sendingRecommendation && styles.disabledButton]}
              onPress={handleSend}
              disabled={sendingRecommendation}
            >
              <Text style={styles.modalPrimaryButtonText}>
                {sendingRecommendation ? 'Sending...' : 'Send Recommendation'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setRecommendModalVisible(false);
                setRecipientEmail('');
                setMessage('');
              }}
              disabled={sendingRecommendation}
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
    lineHeight: 24,
    color: GimaColors.mutedText,
    marginBottom: 16,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: GimaColors.ocean,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: GimaColors.leaf,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
recommendButton: {
  flex: 1,
  backgroundColor: GimaColors.coral,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
},

recommendButtonText: {
  color: '#fff',
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
    fontWeight: '800',
    color: GimaColors.mutedText,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: GimaColors.text,
  },
directionsButton: {
  backgroundColor: GimaColors.background,
  borderWidth: 1.5,
  borderColor: GimaColors.coral,
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 14,
},

directionsButtonText: {
  color: GimaColors.coral,
  fontWeight: '800',
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
    borderWidth: 1,
    borderColor: GimaColors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: GimaColors.ocean,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 15,
    color: GimaColors.mutedText,
    marginBottom: 14,
  },
  input: {
    backgroundColor: GimaColors.background,
    borderWidth: 1,
    borderColor: GimaColors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: GimaColors.text,
  },
  messageInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  modalPrimaryButton: {
    backgroundColor: GimaColors.coral,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPrimaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: GimaColors.mutedText,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.65,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: GimaColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: GimaColors.mutedText,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: GimaColors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  emptyText: {
    color: GimaColors.mutedText,
    textAlign: 'center',
  },
});