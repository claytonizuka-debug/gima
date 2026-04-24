import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { getBusinessBySlug, type Business } from '../../services/businessService';
import {
    getRecommendationsForUser,
    type Recommendation,
} from '../../services/recommendationService';

type RecommendationWithBusiness = Recommendation & {
  business: Business | null;
};

export default function RecommendationsScreen() {
  const { user, loading: authLoading } = useAuth();

  const [recommendations, setRecommendations] = useState<RecommendationWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      if (authLoading) {
        return;
      }

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
              style={styles.recommendationCard}
              onPress={() => {
                if (recommendation.business) {
                  router.push(`/business/${recommendation.business.slug}` as any);
                }
              }}
            >
              <Text style={styles.recommendedBy}>
                Recommended by {recommendation.fromEmail}
              </Text>

              <Text style={styles.businessName}>
                {recommendation.business?.name ?? 'Business not found'}
              </Text>

              <Text style={styles.businessDescription}>
                {recommendation.business?.shortDescription ??
                  'This business may no longer be available.'}
              </Text>
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
  recommendedBy: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b6b63',
    marginBottom: 8,
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