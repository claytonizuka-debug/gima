import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BusinessCard } from '@/components/BusinessCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { GimaColors } from '@/constants/gimaTheme';
import { useBusinesses } from '@/hooks/useBusinesses';

export default function HomeScreen() {
  const router = useRouter();
  const { businesses, loading } = useBusinesses();

  const openNowBusinesses = businesses.filter(
    (b) => b.section === 'Open Now'
  );

  const happeningTodayBusinesses = businesses.filter(
    (b) => b.section === 'Happening Today'
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>SAIPAN • CNMI</Text>
        <Text style={styles.title}>Gima</Text>
        <Text style={styles.subtitle}>
          Discover local spots, daily finds, and recommendations across the Marianas.
        </Text>

        {/* FIXED PILLS */}
        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Ocean</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Food</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Explore</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Open Now</Text>
            <Text style={styles.sectionCaption}>Ready when you are</Text>
          </View>

          <View style={styles.sectionDot} />
        </View>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
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

        {/* FIXED CTA */}
        <Pressable style={styles.ctaButton} onPress={() => router.push('/discover')}>
          <Text style={styles.ctaButtonText}>Explore More</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Happening Today</Text>
            <Text style={styles.sectionCaption}>Island activity</Text>
          </View>

          <View style={styles.sectionDot} />
        </View>

        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
        ) : happeningTodayBusinesses.length > 0 ? (
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
    backgroundColor: GimaColors.background,
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
    color: GimaColors.mutedText,
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GimaColors.mutedText,
    lineHeight: 24,
  },

  pillRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },

  // FIX: remove opacity and add border
  pill: {
    backgroundColor: GimaColors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: GimaColors.coral,
  },
  pillText: {
    color: GimaColors.coral,
    fontWeight: '700',
    fontSize: 13,
  },

  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: GimaColors.ocean,
  },
  sectionCaption: {
    fontSize: 13,
    color: GimaColors.mutedText,
  },

  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GimaColors.coral,
  },

  helperText: {
    fontSize: 15,
    color: GimaColors.mutedText,
  },

  // FIX: solid coral button
  ctaButton: {
    marginTop: 12,
    backgroundColor: GimaColors.coral,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#111', // darker text for light coral
    fontWeight: '700',
  },
});