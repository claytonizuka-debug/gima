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
import { useSavedBusinesses } from "@/context/SavedBusinessesContext";
import { beaches } from "@/data/beaches";
import { useBidaTheme } from "@/hooks/useBidaTheme";
import { useBusinesses } from "@/hooks/useBusinesses";

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
  const colors = useBidaTheme();
  const styles = createStyles(colors);

  const { businesses, loading } = useBusinesses();
  const {
    savedSlugs,
    loading: savedLoading,
    toggleSaved,
  } = useSavedBusinesses();

  const savedBusinessSlugs = savedSlugs.filter(
    (slug) => !slug.startsWith("beach:"),
  );

  const savedBusinesses = businesses.filter((business) =>
    savedBusinessSlugs.includes(business.slug),
  );

  const savedBeaches = beaches.filter((beach) => savedSlugs.includes(beach.id));

  const isLoading = loading || savedLoading;
  const totalSaved = savedBusinesses.length + savedBeaches.length;

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

        {!isLoading ? (
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{totalSaved}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : totalSaved > 0 ? (
          <>
            {savedBeaches.length > 0 ? (
              <View style={styles.group}>
                <Text style={styles.groupTitle}>Beaches</Text>

                {savedBeaches.map((beach) => (
                  <Pressable
                    key={beach.id}
                    style={({ pressed }) => [
                      styles.beachCard,
                      pressed && styles.pressedCard,
                    ]}
                    onPress={() => router.push(`/beach/${beach.slug}` as any)}
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
                        {beach.shortDescription}
                      </Text>

                      <View style={styles.beachActions}>
                        <Pressable
                          style={({ pressed }) => [
                            styles.mapButton,
                            pressed && styles.pressedButton,
                          ]}
                          onPress={(event) => {
                            event.stopPropagation();
                            openMaps(beach.name);
                          }}
                        >
                          <Text style={styles.mapButtonText}>Directions</Text>
                        </Pressable>

                        <Pressable
                          style={({ pressed }) => [
                            styles.removeButton,
                            pressed && styles.pressedButton,
                          ]}
                          onPress={(event) => {
                            event.stopPropagation();
                            toggleSaved(beach.id);
                          }}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {savedBusinesses.length > 0 ? (
              <View style={styles.group}>
                <Text style={styles.groupTitle}>Businesses</Text>

                {savedBusinesses.map((business) => (
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

function createStyles(colors: ReturnType<typeof useBidaTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 110,
    },

    hero: {
      marginBottom: 24,
    },

    eyebrow: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1.4,
      color: colors.coral,
      marginBottom: 8,
    },

    title: {
      fontSize: 34,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 16,
      color: colors.mutedText,
      lineHeight: 24,
    },

    resultsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },

    resultsTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.text,
    },

    resultsCaption: {
      fontSize: 13,
      color: colors.mutedText,
      marginTop: 2,
    },

    countPill: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.coral,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 999,
    },

    countPillText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.text,
    },

    section: {
      marginBottom: 18,
    },

    group: {
      marginBottom: 22,
    },

    groupTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 10,
    },

    savedWrapper: {
      position: "relative",
      marginBottom: 12,
    },

    savedCard: {
      borderColor: colors.leaf,
      borderWidth: 1.5,
      borderRadius: 22,
    },

    beachCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: colors.leaf,
      marginBottom: 14,
    },

    pressedCard: {
      opacity: 0.88,
      transform: [{ scale: 0.99 }],
    },

    beachImage: {
      width: "100%",
      height: 180,
      backgroundColor: colors.background,
    },

    beachText: {
      padding: 16,
    },

    beachName: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 4,
    },

    beachDescription: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.mutedText,
    },

    beachActions: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    },

    savedBadge: {
      position: "absolute",
      top: 10,
      right: 12,
      zIndex: 10,
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

    mapButton: {
      borderWidth: 1.5,
      borderColor: colors.coral,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
      backgroundColor: colors.background,
    },

    mapButtonText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.coral,
    },

    removeButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
      backgroundColor: colors.background,
    },

    removeButtonText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.mutedText,
    },

    pressedButton: {
      opacity: 0.75,
    },

    emptyState: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 8,
    },

    emptyText: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.mutedText,
    },
  });
}
