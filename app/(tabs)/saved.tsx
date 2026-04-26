import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BusinessCard } from "@/components/BusinessCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { BidaColors } from "@/constants/bidaTheme";
import { useSavedBusinesses } from "@/context/SavedBusinessesContext";
import { useBusinesses } from "@/hooks/useBusinesses";

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { businesses, loading } = useBusinesses();
  const { savedSlugs, loading: savedLoading } = useSavedBusinesses();

  const savedList = businesses.filter((business) =>
    savedSlugs.includes(business.slug),
  );

  const isLoading = loading || savedLoading;

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
          Keep track of businesses you want to visit again.
        </Text>
      </View>

      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.resultsTitle}>Saved</Text>
          <Text style={styles.resultsCaption}>Your personal island list</Text>
        </View>

        {!isLoading && (
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{savedList.length}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : savedList.length > 0 ? (
          savedList.map((business) => (
            <View key={business.slug} style={styles.savedWrapper}>
              {/* Leaf indicator */}
              <View style={styles.savedBadge}>
                <Text style={styles.savedBadgeText}>Saved</Text>
              </View>

              <BusinessCard
                name={business.name}
                description={business.shortDescription}
                image={business.image}
                onPress={() => router.push(`/business/${business.slug}` as any)}
                style={styles.savedCard}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No saved places yet</Text>
            <Text style={styles.emptyText}>
              Save businesses from Discover or recommendations to build your
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

  savedWrapper: {
    position: "relative",
    marginBottom: 12,
  },

  savedCard: {
    borderColor: BidaColors.leaf,
    borderWidth: 1.5,
    borderRadius: 18,
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
