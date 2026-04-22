import { useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSavedBusinesses } from '@/context/SavedBusinessesContext';
import { businesses } from '@/data/businesses';

export default function BusinessDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const business = businesses.find((item) => item.slug === slug);

  const { toggleSaved, isSaved } = useSavedBusinesses();

  if (!business) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Business not found</Text>
        <Text style={styles.description}>
          We could not find information for this business.
        </Text>
      </View>
    );
  }

  const saved = isSaved(business.slug);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: business.image }}
        style={styles.image}
      />

      <View style={styles.topRow}>
        <Text style={styles.category}>{business.category}</Text>
        <Text style={styles.status}>{business.status}</Text>
      </View>

      <Text style={styles.title}>{business.name}</Text>
      <Text style={styles.description}>{business.description}</Text>

      <Pressable
        style={[styles.saveButton, saved && styles.savedButton]}
        onPress={() => toggleSaved(business.slug)}
      >
        <Text style={[styles.saveButtonText, saved && styles.savedButtonText]}>
          {saved ? 'Saved' : 'Save Business'}
        </Text>
      </Pressable>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Hours</Text>
        <Text style={styles.infoText}>{business.hours}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Location</Text>
        <Text style={styles.infoText}>{business.location}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  image: {
    height: 220,
    width: '100%',
    borderRadius: 16,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  status: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0a7',
    backgroundColor: '#e7f8f2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  savedButton: {
    backgroundColor: '#e7f8f2',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savedButtonText: {
    color: '#0a7',
  },
  infoCard: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoText: {
    fontSize: 16,
    color: '#111',
  },
});