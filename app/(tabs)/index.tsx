import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { useBusinesses } from '@/hooks/useBusinesses';

export default function HomeScreen() {
  const router = useRouter();
  const { businesses, loading } = useBusinesses();

  const openNowBusinesses = businesses.filter(
    (business) => business.section === 'Open Now'
  );

  const happeningTodayBusinesses = businesses.filter(
    (business) => business.section === 'Happening Today'
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>SAIPAN LOCAL GUIDE</Text>
        <Text style={styles.title}>Gima</Text>
        <Text style={styles.subtitle}>
          Discover what’s open, what’s happening today, and the places worth checking out.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Open Now</Text>
          <Text style={styles.sectionCaption}>Live local picks</Text>
        </View>

        {loading ? (
          <Text style={styles.helperText}>Loading businesses...</Text>
        ) : openNowBusinesses.length > 0 ? (
          openNowBusinesses.map((business) => (
            <BusinessCard
              key={business.slug}
              name={business.name}
              description={business.shortDescription}
              image={business.image}
              onPress={() => router.push(`/business/${business.slug}` as any)}
            />
          ))
        ) : (
          <Text style={styles.helperText}>No businesses found.</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Happening Today</Text>
          <Text style={styles.sectionCaption}>Fresh activity</Text>
        </View>

        {loading ? null : happeningTodayBusinesses.length > 0 ? (
          happeningTodayBusinesses.map((business) => (
            <BusinessCard
              key={business.slug}
              name={business.name}
              description={business.shortDescription}
              image={business.image}
              onPress={() => router.push(`/business/${business.slug}` as any)}
            />
          ))
        ) : (
          <Text style={styles.helperText}>No businesses found.</Text>
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
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#6b6b63',
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5f5f58',
    maxWidth: '95%',
  },
  section: {
    marginTop: 10,
    marginBottom: 18,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  sectionCaption: {
    fontSize: 14,
    color: '#77776f',
  },
  helperText: {
    fontSize: 16,
    color: '#77776f',
  },
});