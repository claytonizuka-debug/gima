import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GimaColors } from '@/constants/gimaTheme';
import { useAuth } from '@/context/AuthContext';

import { getBusinessBySlug, type Business } from '../../services/businessService';
import {
  getRecommendationsForUser,
  markAllRecommendationsAsRead,
  updateRecommendationArchived,
  updateRecommendationPinned,
  type Recommendation,
} from '../../services/recommendationService';

type RecommendationWithBusiness = Recommendation & {
  business: Business | null;
};

function formatRecommendationDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function RecommendationsScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading } = useAuth();

  const [recommendations, setRecommendations] = useState<RecommendationWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  async function loadRecommendations() {
    if (authLoading) return;

    if (!user) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getRecommendationsForUser(user.uid);

      const withBusinesses = await Promise.all(
        data.map(async (recommendation) => ({
          ...recommendation,
          business: await getBusinessBySlug(recommendation.businessSlug),
        }))
      );

      setRecommendations(withBusinesses);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecommendations();
  }, [user, authLoading]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      setTimeout(async () => {
        await markAllRecommendationsAsRead(user.uid);

        setRecommendations((current) =>
          current.map((recommendation) => ({
            ...recommendation,
            read: true,
          }))
        );
      }, 1200);
    }, [user])
  );

  const visibleRecommendations = useMemo(() => {
    return recommendations
      .filter((recommendation) =>
        showArchived ? recommendation.archived : !recommendation.archived
      )
      .sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return Number(b.pinned) - Number(a.pinned);
      });
  }, [recommendations, showArchived]);

  async function handleTogglePin(recommendation: RecommendationWithBusiness) {
    await updateRecommendationPinned(recommendation.id, !recommendation.pinned);

    setRecommendations((current) =>
      current.map((item) =>
        item.id === recommendation.id
          ? { ...item, pinned: !recommendation.pinned }
          : item
      )
    );
  }

  async function handleToggleArchive(recommendation: RecommendationWithBusiness) {
    await updateRecommendationArchived(
      recommendation.id,
      !recommendation.archived
    );

    setRecommendations((current) =>
      current.map((item) =>
        item.id === recommendation.id
          ? { ...item, archived: !recommendation.archived }
          : item
      )
    );
  }

  function renderPinAction(recommendation: RecommendationWithBusiness) {
    return (
      <Pressable
        style={styles.leftSwipeAction}
        onPress={() => handleTogglePin(recommendation)}
      >
        <Ionicons
          name={recommendation.pinned ? 'bookmark' : 'bookmark-outline'}
          size={24}
          color="#fff"
        />
      </Pressable>
    );
  }

  function renderArchiveAction(recommendation: RecommendationWithBusiness) {
    return (
      <Pressable
        style={styles.rightSwipeAction}
        onPress={() => handleToggleArchive(recommendation)}
      >
        <Ionicons
          name={recommendation.archived ? 'archive' : 'archive-outline'}
          size={24}
          color="#fff"
        />
      </Pressable>
    );
  }

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
        <Text style={styles.eyebrow}>INBOX</Text>

        <Text style={styles.title} numberOfLines={1}>
          Recommendations
        </Text>

        <Text style={styles.subtitle}>
          Places shared with you by other Gima users.
        </Text>

      {user ? (
        <View style={styles.segmentedControl}>
          <Pressable
            style={[
              styles.segmentButton,
              !showArchived && styles.segmentButtonActive,
            ]}
            onPress={() => setShowArchived(false)}
          >
            <Text
              style={[
                styles.segmentButtonText,
                !showArchived && styles.segmentButtonTextActive,
              ]}
            >
              Active
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentButton,
              showArchived && styles.segmentButtonActive,
            ]}
            onPress={() => setShowArchived(true)}
          >
            <Text
              style={[
                styles.segmentButtonText,
                showArchived && styles.segmentButtonTextActive,
              ]}
            >
              Archive
            </Text>
          </Pressable>
        </View>
      ) : null}
      </View>

      <View style={styles.section}>
        {loading ? (
          <Text style={styles.helperText}>Loading recommendations...</Text>
        ) : !user ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Log in to see recommendations</Text>
            <Text style={styles.emptyText}>
              Create an account or log in to receive places from other users.
            </Text>

            <Pressable style={styles.primaryButton} onPress={() => router.push('/auth')}>
              <Text style={styles.primaryButtonText}>Log In / Sign Up</Text>
            </Pressable>
          </View>
        ) : visibleRecommendations.length > 0 ? (
          visibleRecommendations.map((recommendation) => (
            <Swipeable
              key={recommendation.id}
              renderLeftActions={() => renderPinAction(recommendation)}
              renderRightActions={() => renderArchiveAction(recommendation)}
              overshootLeft={false}
              overshootRight={false}
            >
              <Pressable
                style={[
                  styles.recommendationCard,
                  recommendation.pinned && styles.pinnedCard,
                  recommendation.archived && styles.archivedCard,
                  !recommendation.read && styles.unreadCard,
                ]}
                onPress={() => {
                  if (recommendation.business) {
                    router.push(`/business/${recommendation.business.slug}` as any);
                  }
                }}
              >
                <View style={styles.cardTopRow}>
                  <View style={styles.senderBlock}>
                    <Text style={styles.recommendedBy}>
                      Recommended by {recommendation.fromEmail}
                    </Text>

                    <Text style={styles.sentAt}>
                      {formatRecommendationDate(recommendation.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.badgeRow}>
                    {recommendation.pinned ? (
                      <View style={styles.iconPill}>
                        <Ionicons
                          name="bookmark"
                          size={14}
                          color={GimaColors.ocean}
                        />
                      </View>
                    ) : null}

                    {recommendation.archived ? (
                      <View style={styles.iconPill}>
                        <Ionicons
                          name="archive-outline"
                          size={14}
                          color={GimaColors.mutedText}
                        />
                      </View>
                    ) : null}

                    {!recommendation.read ? (
                      <View style={styles.unreadPill}>
                        <Text style={styles.unreadPillText}>New</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <Text style={styles.businessName}>
                  {recommendation.business?.name ?? 'Business not found'}
                </Text>

                <Text style={styles.businessDescription}>
                  {recommendation.business?.shortDescription ??
                    'This business may no longer be available.'}
                </Text>

                {recommendation.message ? (
                  <View style={styles.messageBubble}>
                    <Text style={styles.messageLabel}>Message</Text>
                    <Text style={styles.messageText}>“{recommendation.message}”</Text>
                  </View>
                ) : null}

                <View style={styles.swipeHintRow}>
                  <Text style={styles.swipeHint}>Swipe right to save</Text>
                  <Text style={styles.swipeHint}>
                    {showArchived ? 'Swipe left to unarchive' : 'Swipe left to archive'}
                  </Text>
                </View>
              </Pressable>
            </Swipeable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {showArchived ? 'No archived recommendations' : 'No recommendations yet'}
            </Text>
            <Text style={styles.emptyText}>
              {showArchived
                ? 'Archived recommendations will appear here.'
                : 'When someone recommends a place to you, it will appear here.'}
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
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: GimaColors.mutedText,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GimaColors.mutedText,
    lineHeight: 24,
  },
  segmentedControl: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 14,
    backgroundColor: GimaColors.card,
    borderWidth: 1,
    borderColor: GimaColors.border,
    borderRadius: 999,
    padding: 4,
  },

  segmentButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },

  segmentButtonActive: {
    backgroundColor: GimaColors.coral,
  },

  segmentButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: GimaColors.mutedText,
  },

  segmentButtonTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 18,
  },
  helperText: {
    fontSize: 16,
    color: GimaColors.mutedText,
  },
  recommendationCard: {
    backgroundColor: GimaColors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: GimaColors.border,
    marginBottom: 14,
  },
  unreadCard: {
    borderColor: GimaColors.coral,
    borderWidth: 1.5,
  },
  pinnedCard: {
    borderColor: GimaColors.ocean,
    borderWidth: 1.5,
  },
  archivedCard: {
    borderColor: GimaColors.border,
    borderWidth: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  senderBlock: {
    flex: 1,
  },
  recommendedBy: {
    fontSize: 13,
    fontWeight: '700',
    color: GimaColors.mutedText,
    marginBottom: 3,
  },
  sentAt: {
    fontSize: 12,
    color: GimaColors.mutedText,
  },
  badgeRow: {
    alignItems: 'flex-end',
    gap: 6,
  },
  iconPill: {
    backgroundColor: GimaColors.background,
    borderWidth: 1,
    borderColor: GimaColors.border,
    padding: 6,
    borderRadius: 999,
  },
  unreadPill: {
    backgroundColor: GimaColors.coral,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  unreadPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  businessName: {
    fontSize: 20,
    fontWeight: '800',
    color: GimaColors.ocean,
    marginBottom: 6,
  },
  businessDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: GimaColors.mutedText,
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: GimaColors.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: GimaColors.coral,
  },
  messageLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: GimaColors.ocean,
    marginBottom: 5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: GimaColors.text,
    fontStyle: 'italic',
  },
  swipeHintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  swipeHint: {
    fontSize: 11,
    fontWeight: '700',
    color: GimaColors.mutedText,
  },
  leftSwipeAction: {
    backgroundColor: GimaColors.ocean,
    justifyContent: 'center',
    alignItems: 'center',
    width: 96,
    borderRadius: 18,
    marginBottom: 14,
  },
  rightSwipeAction: {
    backgroundColor: GimaColors.coral,
    justifyContent: 'center',
    alignItems: 'center',
    width: 112,
    borderRadius: 18,
    marginBottom: 14,
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
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: GimaColors.coral,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  pressedButton: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});