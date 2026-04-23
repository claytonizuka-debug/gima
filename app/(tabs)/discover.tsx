import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { useBusinesses } from '@/hooks/useBusinesses';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { businesses, loading } = useBusinesses();

  const filteredBusinesses = businesses.filter((business) => {
    const query = searchQuery.toLowerCase();

    return (
      business.name.toLowerCase().includes(query) ||
      business.category.toLowerCase().includes(query) ||
      business.location.toLowerCase().includes(query) ||
      business.shortDescription.toLowerCase().includes(query)
    );
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>DISCOVER</Text>
        <Text style={styles.title}>Explore Saipan</Text>
        <Text style={styles.subtitle}>
          Search restaurants, gyms, and other local spots across the island.
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search businesses, categories, or locations"
        placeholderTextColor="#8a8a83"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Results</Text>
        {!loading && (
          <Text style={styles.resultsCount}>
            {filteredBusinesses.length} found
          </Text>
        )}
      </View>

      <View style={styles.section}>
        {loading ? (
          <Text style={styles.helperText}>Loading businesses...</Text>
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <BusinessCard
              key={business.slug}
              name={business.name}
              description={business.shortDescription}
              image={business.image}
              onPress={() => router.push(`/business/${business.slug}` as any)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>
              Try a different keyword, business type, or location.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f4',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  hero: {
    marginTop: 28,
    marginBottom: 22,
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
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  resultsCount: {
    fontSize: 14,
    color: '#77776f',
  },
  section: {
    marginBottom: 18,
  },
  helperText: {
    fontSize: 16,
    color: '#77776f',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },
});