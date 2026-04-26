import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GimaColors } from "@/constants/gimaTheme";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "../../services/authService";
import { getUserProfile, type UserProfile } from "../../services/userService";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }

    loadProfile();
  }, [user]);

  async function handleLogout() {
    try {
      await logOut();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not log out.");
    }
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
        <Text style={styles.eyebrow}>PROFILE</Text>
        <Text style={styles.title}>Your Account</Text>
        <Text style={styles.subtitle}>
          Manage your Gima account and preferences.
        </Text>
      </View>

      {user ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>
              @{profile?.username || user.email?.split("@")[0] || "user"}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyTitle}>You are not logged in</Text>
          <Text style={styles.emptyText}>
            Log in or create an account to save places and send recommendations.
          </Text>

          <Pressable
            style={styles.loginButton}
            onPress={() => router.push("/auth")}
          >
            <Text style={styles.loginButtonText}>Log In / Sign Up</Text>
          </Pressable>
        </View>
      )}
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
    fontWeight: "700",
    letterSpacing: 1.2,
    color: GimaColors.mutedText,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: GimaColors.mutedText,
    lineHeight: 24,
  },
  card: {
    backgroundColor: GimaColors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: GimaColors.border,
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: GimaColors.mutedText,
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: GimaColors.ocean,
  },
  divider: {
    height: 1,
    backgroundColor: GimaColors.border,
    marginVertical: 16,
  },
  logoutButton: {
    backgroundColor: GimaColors.card,
    borderWidth: 1.5,
    borderColor: GimaColors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: GimaColors.mutedText,
    fontWeight: "800",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: GimaColors.coral,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: GimaColors.ocean,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: GimaColors.mutedText,
  },
});
