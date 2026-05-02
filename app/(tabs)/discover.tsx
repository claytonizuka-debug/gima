import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BusinessCard } from "@/components/BusinessCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useBidaTheme } from "@/hooks/useBidaTheme";
import { useBusinesses } from "@/hooks/useBusinesses";

const DEFAULT_FILTER = "All";

export default function DiscoverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useBidaTheme();
  const styles = createStyles(colors);

  const { businesses, loading } = useBusinesses();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_FILTER);

  const filters = useMemo(() => {
    const categories = Array.from(
      new Set(businesses.map((business) => business.category).filter(Boolean)),
    ).sort();

    return [DEFAULT_FILTER, ...categories];
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesFilter =
        selectedFilter === DEFAULT_FILTER ||
        business.category === selectedFilter;

      const matchesSearch =
        query.length === 0 ||
        business.name.toLowerCase().includes(query) ||
        business.shortDescription.toLowerCase().includes(query) ||
        business.location.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [businesses, searchQuery, selectedFilter]);

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
        <Text style={styles.eyebrow}>DISCOVER</Text>
        <Text style={styles.title}>Explore Around You</Text>
        <Text style={styles.subtitle}>
          Browse beaches, food, activities, and local spots across the islands.
        </Text>
      </View>

      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={18}
          color={colors.mutedText}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search places"
          placeholderTextColor={colors.mutedText}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {filters.map((filter) => {
          const active = selectedFilter === filter;

          return (
            <Pressable
              key={filter}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.resultsTitle}>Results</Text>
          <Text style={styles.resultsCaption}>
            {loading
              ? "Loading places..."
              : `${filteredBusinesses.length} place${
                  filteredBusinesses.length === 1 ? "" : "s"
                }`}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
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
            <Text style={styles.emptyTitle}>No places found</Text>
            <Text style={styles.emptyText}>
              Try a different search or switch to another category.
            </Text>
          </View>
        )}
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
    contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 36,
    },
    hero: {
      marginBottom: 24,
    },
    eyebrow: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 1.2,
      color: colors.mutedText,
      marginBottom: 8,
    },
    title: {
      fontSize: 34,
      fontWeight: "900",
      color: colors.ocean,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.mutedText,
      lineHeight: 24,
    },
    searchWrapper: {
      position: "relative",
      marginBottom: 14,
    },
    searchIcon: {
      position: "absolute",
      left: 14,
      top: 15,
      zIndex: 2,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingLeft: 42,
      paddingRight: 14,
      paddingVertical: 13,
      fontSize: 15,
      color: colors.text,
    },
    filterScroll: {
      paddingRight: 10,
      marginBottom: 18,
    },
    filterChip: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
    },
    filterChipActive: {
      backgroundColor: colors.coral,
      borderColor: colors.coral,
    },
    filterChipText: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.mutedText,
    },
    filterChipTextActive: {
      color: "#fff",
    },
    resultsHeader: {
      marginBottom: 12,
    },
    resultsTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.ocean,
      marginBottom: 2,
    },
    resultsCaption: {
      fontSize: 13,
      color: colors.mutedText,
    },
    section: {
      marginBottom: 18,
    },
    emptyState: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.ocean,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.mutedText,
    },
  });
}
