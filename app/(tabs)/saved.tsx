import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { useSavedBusinesses } from '@/context/SavedBusinessesContext';
import { useBusinesses } from '@/hooks/useBusinesses';

export default function SavedScreen() {
  const router = useRouter();
  const { savedSlugs, loading: savedLoading } = useSavedBusinesses();
  const { businesses, loading: businessesLoading } = useBusinesses();

  const loading = savedLoading || businessesLoading;

  const savedBusinesses = businesses.filter((business) =>
    savedSlugs.includes(business.slug)
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>YOUR LIST</Text>
        <Text style={styles.title}>Saved Places</Text>
        <Text style={styles.subtitle}>
          Keep track of the spots you want to revisit across Saipan.
        </Text>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Saved</Text>
        {!loading && (
          <Text style={styles.resultsCount}>
            {savedBusinesses.length} saved
          </Text>
        )}
      </View>

      <View style={styles.section}>
        {loading ? (
          <Text style={styles.helperText}>Loading saved businesses...</Text>
        ) : savedBusinesses.length > 0 ? (
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
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No saved places yet</Text>
            <Text style={styles.emptyText}>
              Save a business to build your personal island shortlist.
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