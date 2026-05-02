import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useSavedBusinesses } from "@/context/SavedBusinessesContext";
import { useBidaTheme } from "@/hooks/useBidaTheme";
import { subscribeToUnreadRecommendationCount } from "../../services/recommendationService";

export default function TabLayout() {
  const { user } = useAuth();
  const { savedSlugs } = useSavedBusinesses();
  const colors = useBidaTheme();

  const [unreadRecommendationsCount, setUnreadRecommendationsCount] =
    useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadRecommendationsCount(0);
      return;
    }

    const unsubscribe = subscribeToUnreadRecommendationCount(
      user.uid,
      setUnreadRecommendationsCount,
    );

    return unsubscribe;
  }, [user]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.coral,
        tabBarInactiveTintColor: colors.mutedText,

        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarBadgeStyle: {
          backgroundColor: colors.coral,
          color: "#fff",
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
          tabBarBadge: savedSlugs.length > 0 ? savedSlugs.length : undefined,
        }}
      />

      <Tabs.Screen
        name="recommendations"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
          tabBarBadge:
            unreadRecommendationsCount > 0
              ? unreadRecommendationsCount
              : undefined,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
