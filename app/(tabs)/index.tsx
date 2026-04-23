import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { SkeletonCard } from '@/components/SkeletonCard';
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
          Discover what’s open and what’s happening today.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open Now</Text>

        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : openNowBusinesses.map((business) => (
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

        {loading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
          : happeningTodayBusinesses.map((business) => (
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
  container: { flex: 1, backgroundColor: '#f7f7f4' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 36 },
  hero: { marginTop: 28, marginBottom: 28 },
  eyebrow: { fontSize: 12, fontWeight: '700', color: '#6b6b63' },
  title: { fontSize: 40, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 16, color: '#5f5f58' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
});