import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BusinessCard } from '@/components/BusinessCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { GimaColors } from '@/constants/gimaTheme';
import { useBusinesses } from '@/hooks/useBusinesses';

const FILTERS = ['All', 'Food', 'Fitness', 'Beaches', 'Attractions', 'Events', 'Shopping', 'Services', 'Hotels'];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { businesses, loading } = useBusinesses();

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const query = searchQuery.trim().toLowerCase();
      const category = (business.category || '').toLowerCase();

      const matchesSearch =
        !query ||
        business.name.toLowerCase().includes(query) ||
        category.includes(query) ||
        business.location.toLowerCase().includes(query) ||
        business.shortDescription.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === 'All' ||
        category.includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [businesses, searchQuery, activeFilter]);

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
        <Text style={styles.title}>Explore Saipan</Text>
        <Text style={styles.subtitle}>
          Search local businesses, island favorites, and places worth checking out.
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search businesses, categories, or locations"
        placeholderTextColor={GimaColors.mutedText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <Pressable
              key={filter}
              style={({ pressed }) => [
                styles.filterPill,
                isActive && styles.activeFilterPill,
                pressed && styles.pressedButton,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive && styles.activeFilterPillText,
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
            {activeFilter === 'All'
              ? 'Find your next local stop'
              : activeFilter}
          </Text>
        </View>

        {!loading && (
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>
              {filteredBusinesses.length} found
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
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
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptyText}>
              Try another keyword, category, or location.
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
    backgroundColor: GimaColors.background,
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
    fontWeight: '700',
    letterSpacing: 1.2,
    color: GimaColors.mutedText,
    marginBottom: 6,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GimaColors.mutedText,
    lineHeight: 24,
  },
  searchInput: {
    backgroundColor: GimaColors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: GimaColors.text,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: GimaColors.coral,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 18,
  },
  filterPill: {
    backgroundColor: GimaColors.card,
    borderWidth: 1,
    borderColor: GimaColors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  activeFilterPill: {
    backgroundColor: GimaColors.coral,
    borderColor: GimaColors.coral,
  },
  filterPillText: {
    color: GimaColors.text,
    fontWeight: '800',
    fontSize: 13,
  },
  activeFilterPillText: {
    color: '#fff',
  },
  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: GimaColors.ocean,
  },
  resultsCaption: {
    fontSize: 13,
    color: GimaColors.mutedText,
    marginTop: 2,
  },
  countPill: {
    backgroundColor: GimaColors.card,
    borderWidth: 1,
    borderColor: GimaColors.coral,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: GimaColors.text,
  },
  section: {
    marginBottom: 18,
  },
  emptyState: {
    backgroundColor: GimaColors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: GimaColors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: GimaColors.mutedText,
  },
});