import { Ionicons } from "@expo/vector-icons";
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
import { useSavedBusinesses } from "@/context/SavedBusinessesContext";
import { beaches } from "@/data/beaches";
import { useBidaTheme } from "@/hooks/useBidaTheme";
import { useBusinesses } from "@/hooks/useBusinesses";

function openMaps(lat: number, lng: number, name: string) {
  const label = encodeURIComponent(name);

  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`
      : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;

  Linking.openURL(url);
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useBidaTheme();
  const styles = createStyles(colors);

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Beaches</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {beaches.map((beach) => {
              const isSaved = savedSlugs.includes(beach.id);

              return (
                <Pressable
                  key={beach.id}
                  style={[styles.beachCard, isSaved && styles.savedBeachCard]}
                  onPress={() => router.push(`/beach/${beach.slug}` as any)}
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
                    hitSlop={12}
                    onPress={(event) => {
                      event.stopPropagation();
                      toggleSaved(beach.id);
                    }}
                  >
                    <Ionicons
                      name={isSaved ? "bookmark" : "bookmark-outline"}
                      size={20}
                      color="#fff"
                    />
                  </Pressable>

                  {isSaved ? (
                    <View style={styles.savedBadge}>
                      <Text style={styles.savedBadgeText}>Saved</Text>
                    </View>
                  ) : null}

                  <View style={styles.beachText}>
                    <Text style={styles.beachName}>{beach.name}</Text>
                    <Text style={styles.beachDescription}>
                      {beach.shortDescription}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

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
                onPress={() => router.push(`/business/${business.slug}` as any)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nothing open right now</Text>
              <Text style={styles.emptyText}>
                Check back later for businesses currently open.
              </Text>
            </View>
          )}
        </View>

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
                onPress={() => router.push(`/business/${business.slug}` as any)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nothing listed today</Text>
              <Text style={styles.emptyText}>
                Events and activities will appear here.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof useBidaTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    heroWrapper: {
      marginBottom: 22,
    },
    heroImage: {
      width: "100%",
      justifyContent: "flex-end",
    },
    heroOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    heroEyebrow: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1.2,
      color: "#fff",
      marginBottom: 8,
    },
    heroTitle: {
      fontSize: 42,
      fontWeight: "900",
      color: "#fff",
      marginBottom: 6,
    },
    heroSubtitle: {
      fontSize: 16,
      lineHeight: 23,
      color: "#fff",
    },
    content: {
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 26,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.ocean,
      marginBottom: 12,
    },
    beachCard: {
      width: 220,
      marginRight: 12,
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    savedBeachCard: {
      borderColor: colors.leaf,
      borderWidth: 2,
    },
    beachImage: {
      width: "100%",
      height: 130,
    },
    saveButton: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 10,
      backgroundColor: "rgba(255,255,255,0.92)",
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonActive: {
      backgroundColor: colors.leaf,
    },
    savedBadge: {
      position: "absolute",
      left: 10,
      top: 10,
      backgroundColor: colors.leaf,
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 999,
    },
    savedBadgeText: {
      color: "#fff",
      fontSize: 11,
      fontWeight: "900",
    },
    beachText: {
      padding: 12,
    },
    beachName: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.ocean,
      marginBottom: 4,
    },
    beachDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.mutedText,
    },
    emptyState: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.ocean,
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.mutedText,
    },
  });
}
