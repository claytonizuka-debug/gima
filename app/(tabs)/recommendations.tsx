import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { getBusinessBySlug, type Business } from '../../services/businessService';
import {
    getRecommendationsForUser,
    markAllRecommendationsAsRead,
    type Recommendation,
} from '../../services/recommendationService';

type RecommendationWithBusiness = Recommendation & {
  business: Business | null;
};

function formatRecommendationDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function RecommendationsScreen() {
  const { user, loading: authLoading } = useAuth();

  const [recommendations, setRecommendations] = useState<RecommendationWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      if (authLoading) return;

      if (!user) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getRecommendationsForUser(user.uid);

        const recommendationsWithBusinesses = await Promise.all(
          data.map(async (recommendation) => {
            const business = await getBusinessBySlug(recommendation.businessSlug);

            return {
              ...recommendation,
              business,
            };
          })
        );

        setRecommendations(recommendationsWithBusinesses);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadRecommendations();
  }, [user, authLoading]);

  useFocusEffect(
    useCallback(() => {
      async function markAsReadOnFocus() {
        if (!user) return;

        try {
          setTimeout(async () => {
            await markAllRecommendationsAsRead(user.uid);

            setRecommendations((current) =>
              current.map((recommendation) => ({
                ...recommendation,
                read: true,
              }))
            );
          }, 1200);
        } catch (error) {
          console.error('Error marking recommendations as read:', error);
        }
      }

      markAsReadOnFocus();
    }, [user])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>RECOMMENDATIONS</Text>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.subtitle}>
          Places other users think you should check out.
        </Text>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Recommended</Text>
        {!loading && user && (
          <Text style={styles.resultsCount}>
            {recommendations.length} total
          </Text>
        )}
      </View>

      <View style={styles.section}>
        {loading ? (
          <Text style={styles.helperText}>Loading recommendations...</Text>
        ) : !user ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Log in to see recommendations</Text>
            <Text style={styles.emptyText}>
              Create an account or log in to receive recommendations from others.
            </Text>
            <Pressable style={styles.button} onPress={() => router.push('/auth')}>
              <Text style={styles.buttonText}>Log In / Sign Up</Text>
            </Pressable>
          </View>
        ) : recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <Pressable
              key={recommendation.id}
              style={[
                styles.recommendationCard,
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

                {!recommendation.read && (
                  <View style={styles.unreadPill}>
                    <Text style={styles.unreadPillText}>New</Text>
                  </View>
                )}
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
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No recommendations yet</Text>
            <Text style={styles.emptyText}>
              When someone sends you a place to check out, it will appear here.
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
    backgroundColor: '#f7f7f4',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  hero: {
    marginTop: 28,
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#6b6b63',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5f5f58',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  resultsCount: {
    fontSize: 14,
    color: '#77776f',
  },
  section: {
    marginBottom: 18,
  },
  helperText: {
    fontSize: 16,
    color: '#77776f',
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#ececec',
    marginBottom: 14,
  },
  unreadCard: {
    borderColor: '#cfead8',
    backgroundColor: '#fbfffc',
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
    color: '#6b6b63',
    marginBottom: 3,
  },
  sentAt: {
    fontSize: 12,
    color: '#8a8a83',
  },
  unreadPill: {
    backgroundColor: '#e9f7ef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  unreadPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#198754',
  },
  businessName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 6,
  },
  businessDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: '#f7f7f4',
    borderRadius: 14,
    padding: 12,
    marginTop: 2,
  },
  messageLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#6b6b63',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    fontStyle: 'italic',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});