import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { businesses } from '@/data/businesses';

export default function HomeScreen() {
  const router = useRouter();

  const openNowBusinesses = businesses.filter(
    (business) => business.section === 'Open Now'
  );

  const happeningTodayBusinesses = businesses.filter(
    (business) => business.section === 'Happening Today'
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gima</Text>
      <Text style={styles.subtitle}>What’s happening in Saipan</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open Now</Text>

        {openNowBusinesses.map((business) => (
          <BusinessCard
            key={business.slug}
            name={business.name}
            description={business.shortDescription}
            image={business.image}
            onPress={() => router.push(`/business/${business.slug}` as any)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Happening Today</Text>

        {happeningTodayBusinesses.map((business) => (
          <BusinessCard
            key={business.slug}
            name={business.name}
            description={business.shortDescription}
            image={business.image}
            onPress={() => router.push(`/business/${business.slug}` as any)}
          />
        ))}
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
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
});