import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { businesses } from '@/data/businesses';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.subtitle}>
        Browse more businesses across Saipan.
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search businesses, categories, or locations"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.section}>
        {filteredBusinesses.length > 0 ? (
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
          <Text style={styles.noResults}>No businesses found.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    marginTop: 10,
  },
  noResults: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});