import { useRouter } from "expo-router";
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
  },
  {
    id: "beach:ladder-beach",
    name: "Ladder Beach",
    description: "A quiet beach spot with cliffs and clear water.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900",
  },
  {
    id: "beach:obyan-beach",
    name: "Obyan Beach",
    description: "Popular for snorkeling, sand, and peaceful views.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
  },
];

function openMaps(name: string) {
  const query = encodeURIComponent(`${name} Saipan CNMI`);

  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?q=${query}`
      : `geo:0,0?q=${query}`;

  Linking.openURL(url);
}

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { businesses, loading } = useBusinesses();
  const {
    savedSlugs,
    loading: savedLoading,
    toggleSaved,
  } = useSavedBusinesses();

  const savedBusinessSlugs = savedSlugs.filter(
    (slug) => !slug.startsWith("beach:"),
  );

  const savedList = businesses.filter((business) =>
    savedBusinessSlugs.includes(business.slug),
  );

  const savedBeaches = topBeaches.filter((beach) =>
    savedSlugs.includes(beach.id),
  );

  const isLoading = loading || savedLoading;
  const totalSaved = savedList.length + savedBeaches.length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top + 18 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>SAVED</Text>
        <Text style={styles.title}>Your Places</Text>
        <Text style={styles.subtitle}>
          Keep track of beaches and businesses you want to visit again.
        </Text>
      </View>

      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.resultsTitle}>Saved</Text>
          <Text style={styles.resultsCaption}>Your personal island list</Text>
        </View>

        {!isLoading && (
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{totalSaved}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : totalSaved > 0 ? (
          <>
            {savedBeaches.length > 0 ? (
              <View style={styles.group}>
                <Text style={styles.groupTitle}>Beaches</Text>

                {savedBeaches.map((beach) => (
                  <Pressable
                    key={beach.id}
                    style={styles.beachCard}
                    onPress={() => openMaps(beach.name)}
                  >
                    <Image
                      source={{ uri: beach.image }}
                      style={styles.beachImage}
                    />

                    <View style={styles.savedBadge}>
                      <Text style={styles.savedBadgeText}>Saved</Text>
                    </View>

                    <View style={styles.beachText}>
                      <Text style={styles.beachName}>{beach.name}</Text>
                      <Text style={styles.beachDescription}>
                        {beach.description}
                      </Text>

                      <Pressable
                        style={styles.removeButton}
                        onPress={(event) => {
                          event.stopPropagation();
                          toggleSaved(beach.id);
                        }}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {savedList.length > 0 ? (
              <View style={styles.group}>
                <Text style={styles.groupTitle}>Businesses</Text>

                {savedList.map((business) => (
                  <View key={business.slug} style={styles.savedWrapper}>
                    <View style={styles.savedBadge}>
                      <Text style={styles.savedBadgeText}>Saved</Text>
                    </View>

                    <BusinessCard
                      name={business.name}
                      description={business.shortDescription}
                      image={business.image}
                      onPress={() =>
                        router.push(`/business/${business.slug}` as any)
                      }
                      style={styles.savedCard}
                    />
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No saved places yet</Text>
            <Text style={styles.emptyText}>
              Save beaches, businesses, or recommendations to build your island
              list.
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
    backgroundColor: BidaColors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  hero: {
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: BidaColors.mutedText,
    marginBottom: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: BidaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: BidaColors.mutedText,
    lineHeight: 24,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: BidaColors.ocean,
  },
  resultsCaption: {
    fontSize: 13,
    color: BidaColors.mutedText,
    marginTop: 2,
  },
  countPill: {
    backgroundColor: BidaColors.card,
    borderWidth: 1,
    borderColor: BidaColors.coral,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: BidaColors.text,
  },
  section: {
    marginBottom: 18,
  },
  group: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: BidaColors.ocean,
    marginBottom: 10,
  },
  savedWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  savedCard: {
    borderColor: BidaColors.leaf,
    borderWidth: 1.5,
    borderRadius: 18,
  },
  beachCard: {
    backgroundColor: BidaColors.card,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: BidaColors.leaf,
    marginBottom: 14,
  },
  beachImage: {
    width: "100%",
    height: 180,
  },
  beachText: {
    padding: 16,
  },
  beachName: {
    fontSize: 20,
    fontWeight: "900",
    color: BidaColors.ocean,
    marginBottom: 4,
  },
  beachDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: BidaColors.mutedText,
  },
  savedBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    zIndex: 10,
    backgroundColor: BidaColors.leaf,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  savedBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  removeButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: BidaColors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "800",
    color: BidaColors.mutedText,
  },
  emptyState: {
    backgroundColor: BidaColors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: BidaColors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BidaColors.ocean,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: BidaColors.mutedText,
  },
});
