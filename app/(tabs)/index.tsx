import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
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
import { useSavedBusinesses } from "@/context/SavedBusinessesContext";
import { useBusinesses } from "@/hooks/useBusinesses";

const topBeaches = [
  {
    id: "beach:micro-beach",
    name: "Micro Beach",
    description: "Calm waters, sunsets, and easy access in Garapan.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
    lat: 15.215,
    lng: 145.715,
  },
  {
    id: "beach:ladder-beach",
    name: "Ladder Beach",
    description: "A quiet beach spot with cliffs and clear water.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900",
    lat: 15.1255,
    lng: 145.729,
  },
  {
    id: "beach:obyan-beach",
    name: "Obyan Beach",
    description: "Popular for snorkeling, sand, and peaceful views.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
    lat: 15.1186,
    lng: 145.7508,
  },
];

function openMaps(lat: number, lng: number, name: string) {
  const label = encodeURIComponent(name);

  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`
      : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;

  Linking.openURL(url);
}

function openMapsForBusiness(business: any) {
  if (business.lat && business.lng) {
    openMaps(business.lat, business.lng, business.name);
    return;
  }

  const query = encodeURIComponent(
    `${business.name} ${business.location} Saipan CNMI`,
  );

  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?q=${query}`
      : `geo:0,0?q=${query}`;

  Linking.openURL(url);
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { businesses, loading } = useBusinesses();
  const { savedSlugs, toggleSaved } = useSavedBusinesses();

  const openNowBusinesses = businesses.filter(
    (business) => business.section === "Open Now",
  );

  const happeningTodayBusinesses = businesses.filter(
    (business) => business.section === "Happening Today",
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 36 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <View style={styles.heroWrapper}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
          }}
          style={[styles.heroImage, { height: 220 + insets.top }]}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.68)"]}
            style={[styles.heroOverlay, { paddingTop: insets.top }]}
          >
            <Text style={styles.heroEyebrow}>SAIPAN • CNMI</Text>
            <Text style={styles.heroTitle}>Bida</Text>
            <Text style={styles.heroSubtitle}>
              Discover beaches, food, events, and local places around the
              islands.
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View style={styles.content}>
        {/* TOP BEACHES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Beaches</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topBeaches.map((beach) => {
              const isSaved = savedSlugs.includes(beach.id);

              return (
                <Pressable
                  key={beach.id}
                  style={[styles.beachCard, isSaved && styles.savedBeachCard]}
                  onPress={() => openMaps(beach.lat, beach.lng, beach.name)}
                >
                  <Image
                    source={{ uri: beach.image }}
                    style={styles.beachImage}
                  />

                  <Pressable
                    style={[
                      styles.saveButton,
                      isSaved && styles.saveButtonActive,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleSaved(beach.id);
                    }}
                  >
                    <Text style={styles.saveButtonText}>
                      {isSaved ? "✓" : "🌿"}
                    </Text>
                  </Pressable>

                  <View style={styles.beachText}>
                    <Text style={styles.beachName}>{beach.name}</Text>
                    <Text style={styles.beachDescription}>
                      {beach.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* OPEN NOW */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open Now</Text>

          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : openNowBusinesses.length > 0 ? (
            openNowBusinesses.map((business) => (
              <BusinessCard
                key={business.slug}
                name={business.name}
                description={business.shortDescription}
                image={business.image}
                onPress={() => openMapsForBusiness(business)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nothing open right now</Text>
          )}
        </View>

        {/* HAPPENING TODAY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Happening Today</Text>

          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : happeningTodayBusinesses.length > 0 ? (
            happeningTodayBusinesses.map((business) => (
              <BusinessCard
                key={business.slug}
                name={business.name}
                description={business.shortDescription}
                image={business.image}
                onPress={() => openMapsForBusiness(business)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nothing listed today</Text>
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
  heroWrapper: {
    marginBottom: 20,
  },
  heroImage: {
    width: "100%",
    justifyContent: "flex-end",
  },
  heroOverlay: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroEyebrow: {
    color: "#fff",
    fontWeight: "800",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: "#fff",
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: BidaColors.ocean,
    marginBottom: 10,
  },
  beachCard: {
    width: 220,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BidaColors.border,
    backgroundColor: BidaColors.card,
  },
  savedBeachCard: {
    borderColor: BidaColors.leaf,
    borderWidth: 2,
  },
  beachImage: {
    width: "100%",
    height: 130,
  },
  beachText: {
    padding: 10,
  },
  beachName: {
    fontWeight: "800",
    color: BidaColors.ocean,
  },
  beachDescription: {
    color: BidaColors.mutedText,
  },
  saveButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonActive: {
    backgroundColor: BidaColors.leaf,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  emptyText: {
    color: BidaColors.mutedText,
  },
});
