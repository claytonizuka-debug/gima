import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BusinessCard } from '@/components/BusinessCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { GimaColors } from '@/constants/gimaTheme';
import { useBusinesses } from '@/hooks/useBusinesses';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 18 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 🔥 HERO CARD */}
      <View style={styles.heroCard}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
          }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)']}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroEyebrow}>SAIPAN • CNMI</Text>
            <Text style={styles.heroTitle}>Gima</Text>
            <Text style={styles.heroSubtitle}>
              Discover local spots, daily finds, and island recommendations.
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* OPEN NOW */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Open Now</Text>
            <Text style={styles.sectionCaption}>
              Ready when you are
            </Text>
          </View>

          <View style={styles.sectionDot} />
        </View>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : openNowBusinesses.length > 0 ? (
          openNowBusinesses.map((business) => (
            <BusinessCard
              key={business.slug}
              name={business.name}
              description={business.shortDescription}
              image={business.image}
              onPress={() =>
                router.push(`/business/${business.slug}` as any)
              }
            />
          ))
        ) : (
          <Text style={styles.helperText}>
            No businesses found.
          </Text>
        )}

        <Pressable
          style={styles.ctaButton}
          onPress={() => router.push('/discover')}
        >
          <Text style={styles.ctaButtonText}>Explore More</Text>
        </Pressable>
      </View>

      {/* HAPPENING TODAY */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Happening Today
            </Text>
            <Text style={styles.sectionCaption}>
              Island activity
            </Text>
          </View>

          <View style={styles.sectionDot} />
        </View>

        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : happeningTodayBusinesses.length > 0 ? (
          happeningTodayBusinesses.map((business) => (
            <BusinessCard
              key={business.slug}
              name={business.name}
              description={business.shortDescription}
              image={business.image}
              onPress={() =>
                router.push(`/business/${business.slug}` as any)
              }
            />
          ))
        ) : (
          <Text style={styles.helperText}>
            No businesses found.
          </Text>
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
    paddingBottom: 36,
  },

  /* HERO */
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 28,

    // 🔥 make it distinct
    borderWidth: 2,
    borderColor: 'rgba(240, 123, 61, 0.6)',

    // subtle elevation
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 4, // Android
  },
  heroImage: {
    height: 200,
  },
  heroImageStyle: {
    borderRadius: 18,
  },
  heroOverlay: {
    padding: 16,
    justifyContent: 'flex-end',
    height: '100%',
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#fff',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#f1f1f1',
    lineHeight: 20,
  },

  /* SECTION */
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

  ctaButton: {
    marginTop: 12,
    backgroundColor: GimaColors.coral,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
});