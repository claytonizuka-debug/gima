import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BidaColors } from "@/constants/bidaTheme";
import { useAuth } from "@/context/AuthContext";
import { logOut } from "../../services/authService";
import {
  getUserProfile,
  updateUsername,
  type UserProfile,
} from "../../services/userService";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
        setUsernameInput(data?.username || user.email?.split("@")[0] || "");
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }

    loadProfile();
  }, [user]);

  async function handleSaveUsername() {
    if (!user) return;

    try {
      setSavingUsername(true);

      const cleanUsername = await updateUsername(user.uid, usernameInput);

      setProfile((current) =>
        current ? { ...current, username: cleanUsername } : current,
      );

      setUsernameInput(cleanUsername);
      setEditingUsername(false);

      Alert.alert(
        "Username updated",
        `Your username is now @${cleanUsername}.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update username.";

      Alert.alert("Username unavailable", message);
    } finally {
      setSavingUsername(false);
    }
  }

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
          Manage your Bida account and preferences.
        </Text>
      </View>

      {user ? (
        <>
          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Username</Text>

              {!editingUsername ? (
                <Pressable onPress={() => setEditingUsername(true)}>
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              ) : null}
            </View>

            {editingUsername ? (
              <>
                <TextInput
                  style={styles.input}
                  value={usernameInput}
                  onChangeText={setUsernameInput}
                  placeholder="Username"
                  placeholderTextColor={BidaColors.mutedText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={styles.usernameHint}>
                  Use letters, numbers, and underscores only.
                </Text>

                <View style={styles.editActions}>
                  <Pressable
                    style={styles.cancelEditButton}
                    onPress={() => {
                      setUsernameInput(
                        profile?.username || user.email?.split("@")[0] || "",
                      );
                      setEditingUsername(false);
                    }}
                    disabled={savingUsername}
                  >
                    <Text style={styles.cancelEditButtonText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.saveEditButton,
                      savingUsername && styles.disabledButton,
                    ]}
                    onPress={handleSaveUsername}
                    disabled={savingUsername}
                  >
                    <Text style={styles.saveEditButtonText}>
                      {savingUsername ? "Saving..." : "Save"}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Text style={styles.value}>
                @{profile?.username || user.email?.split("@")[0] || "user"}
              </Text>
            )}

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
    backgroundColor: BidaColors.background,
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
    color: BidaColors.mutedText,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: BidaColors.ocean,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: BidaColors.mutedText,
    lineHeight: 24,
  },
  card: {
    backgroundColor: BidaColors.card,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: BidaColors.border,
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: BidaColors.mutedText,
    marginBottom: 6,
  },
  editText: {
    fontSize: 13,
    fontWeight: "800",
    color: BidaColors.coral,
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
    color: BidaColors.ocean,
  },
  input: {
    backgroundColor: BidaColors.background,
    borderWidth: 1.5,
    borderColor: BidaColors.coral,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "700",
    color: BidaColors.text,
  },
  usernameHint: {
    fontSize: 12,
    color: BidaColors.mutedText,
    marginTop: 8,
    lineHeight: 18,
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  cancelEditButton: {
    flex: 1,
    backgroundColor: BidaColors.background,
    borderWidth: 1,
    borderColor: BidaColors.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelEditButtonText: {
    color: BidaColors.mutedText,
    fontWeight: "800",
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: BidaColors.coral,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  saveEditButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.65,
  },
  divider: {
    height: 1,
    backgroundColor: BidaColors.border,
    marginVertical: 16,
  },
  logoutButton: {
    backgroundColor: BidaColors.card,
    borderWidth: 1.5,
    borderColor: BidaColors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: BidaColors.mutedText,
    fontWeight: "800",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: BidaColors.coral,
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
    color: BidaColors.ocean,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: BidaColors.mutedText,
  },
});
