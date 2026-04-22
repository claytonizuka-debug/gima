import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { useSavedBusinesses } from '@/context/SavedBusinessesContext';
import { businesses } from '@/data/businesses';

export default function SavedScreen() {
  const router = useRouter();
  const { savedSlugs } = useSavedBusinesses();

  const savedBusinesses = businesses.filter((business) =>
    savedSlugs.includes(business.slug)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Saved</Text>
      <Text style={styles.subtitle}>Your saved places in Saipan.</Text>

      <View style={styles.section}>
        {savedBusinesses.length > 0 ? (
          savedBusinesses.map((business) => (
            <BusinessCard
              key={business.slug}
              name={business.name}
              description={business.shortDescription}
              image={business.image}
              onPress={() => router.push(`/business/${business.slug}` as any)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>
            You have not saved any businesses yet.
          </Text>
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
  section: {
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});