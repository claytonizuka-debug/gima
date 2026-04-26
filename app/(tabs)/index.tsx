import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BusinessCard } from "@/components/BusinessCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { BidaColors } from "@/constants/bidaTheme";
import { useBusinesses } from "@/hooks/useBusinesses";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { businesses, loading } = useBusinesses();

  const openNowBusinesses = businesses.filter((b) => b.section === "Open Now");

  const happeningTodayBusinesses = businesses.filter(
    (b) => b.section === "Happening Today",
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 36 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 🔥 HERO (FULL BLEED, SAFE AREA FIXED) */}
      <View style={styles.heroWrapper}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
          }}
          style={[styles.heroImage, { height: 220 + insets.top }]}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.65)"]}
            style={[styles.heroOverlay, { paddingTop: insets.top }]}
          >
            <Text style={styles.heroEyebrow}>SAIPAN • CNMI</Text>
            <Text style={styles.heroTitle}>Bida</Text>
            <Text style={styles.heroSubtitle}>
              Discover local spots, daily finds, and island recommendations.
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* CONTENT BELOW HERO */}
      <View style={styles.content}>
        {/* OPEN NOW */}
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

          <Pressable
            style={styles.ctaButton}
            onPress={() => router.push("/discover")}
          >
            <Text style={styles.ctaButtonText}>Explore More</Text>
          </Pressable>
        </View>

        {/* HAPPENING TODAY */}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BidaColors.background,
  },

  /* HERO */
  heroWrapper: {
    marginBottom: 20,
  },
  heroImage: {
    justifyContent: "flex-end",
  },
  heroOverlay: {
    padding: 16,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#fff",
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#f1f1f1",
    lineHeight: 20,
  },

  /* CONTENT */
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: BidaColors.ocean,
  },
  sectionCaption: {
    fontSize: 13,
    color: BidaColors.mutedText,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BidaColors.coral,
  },

  helperText: {
    fontSize: 15,
    color: BidaColors.mutedText,
  },

  ctaButton: {
    marginTop: 12,
    backgroundColor: BidaColors.coral,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
});
