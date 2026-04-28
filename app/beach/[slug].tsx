import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
    Image,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BidaColors } from "@/constants/bidaTheme";
import { useSavedBusinesses } from "@/context/SavedBusinessesContext";

const beaches = [
  {
    id: "beach:micro-beach",
    slug: "micro-beach",
    name: "Micro Beach",
    description:
      "Calm waters, sunset views, and easy access in Garapan. A great place for relaxing, swimming, and enjoying the ocean close to town.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    location: "Garapan, Saipan",
    lat: 15.215,
    lng: 145.715,
  },
  {
    id: "beach:ladder-beach",
    slug: "ladder-beach",
    name: "Ladder Beach",
    description:
      "A quieter beach area known for cliffs, clear water, and a more tucked-away feel. Great for photos and peaceful ocean views.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    location: "Saipan",
    lat: 15.1255,
    lng: 145.729,
  },
  {
    id: "beach:obyan-beach",
    slug: "obyan-beach",
    name: "Obyan Beach",
    description:
      "A beautiful beach known for sand, snorkeling, and peaceful views. A solid pick for visitors looking for a classic Saipan beach stop.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    location: "Obyan, Saipan",
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

export default function BeachDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { savedSlugs, toggleSaved } = useSavedBusinesses();

  const beach = beaches.find((item) => item.slug === slug);

  if (!beach) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={[styles.emptyContainer, { paddingTop: insets.top + 18 }]}>
          <Text style={styles.emptyTitle}>Beach not found</Text>
          <Text style={styles.emptyText}>We could not find this beach.</Text>
        </View>
      </>
    );
  }

  const saved = savedSlugs.includes(beach.id);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: beach.image }} style={styles.image} />

        <View style={styles.content}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={18} color={BidaColors.ocean} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.metaRow}>
            <Text style={styles.categoryPill}>Beach</Text>
            {saved ? <Text style={styles.savedPill}>Saved</Text> : null}
          </View>

          <Text style={styles.title}>{beach.name}</Text>
          <Text style={styles.description}>{beach.description}</Text>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.saveButton, saved && styles.savedButton]}
              onPress={() => toggleSaved(beach.id)}
            >
              <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={18}
                color="#fff"
              />
              <Text style={styles.actionButtonText}>
                {saved ? "Saved" : "Save"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.directionsButton}
              onPress={() => openMaps(beach.lat, beach.lng, beach.name)}
            >
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </Pressable>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.infoText}>{beach.location}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.label}>Good For</Text>
            <Text style={styles.infoText}>
              Sightseeing, relaxing, beach walks, photos, and visiting with
              friends or family.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BidaColors.background,
  },
  image: {
    width: "100%",
    height: 260,
  },
  content: {
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  backButtonText: {
    color: BidaColors.ocean,
    fontWeight: "800",
    marginLeft: 2,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: BidaColors.oceanLight,
    color: BidaColors.ocean,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "800",
  },
  savedPill: {
    backgroundColor: BidaColors.leaf,
    color: "#fff",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "800",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: BidaColors.ocean,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: BidaColors.mutedText,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: BidaColors.ocean,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  savedButton: {
    backgroundColor: BidaColors.leaf,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  directionsButton: {
    flex: 1,
    backgroundColor: BidaColors.background,
    borderWidth: 1.5,
    borderColor: BidaColors.coral,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  directionsButtonText: {
    color: BidaColors.coral,
    fontWeight: "800",
  },
  infoCard: {
    backgroundColor: BidaColors.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BidaColors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: BidaColors.mutedText,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: BidaColors.text,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: BidaColors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BidaColors.ocean,
    marginBottom: 8,
  },
  emptyText: {
    color: BidaColors.mutedText,
    textAlign: "center",
  },
});
