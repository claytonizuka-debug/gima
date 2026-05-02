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

import { useAuth } from "@/context/AuthContext";
import { useBidaTheme } from "@/hooks/useBidaTheme";
import { logOut } from "../../services/authService";
import {
  getUserProfile,
  updateUsername,
  type UserProfile,
} from "../../services/userService";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const colors = useBidaTheme();
  const styles = createStyles(colors);

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
                  placeholderTextColor={colors.mutedText}
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
      marginBottom: 28,
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

    card: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.mutedText,
      marginBottom: 6,
    },

    editText: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.coral,
    },

    value: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
    },

    input: {
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.coral,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },

    usernameHint: {
      fontSize: 12,
      color: colors.mutedText,
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
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
    },

    cancelEditButtonText: {
      color: colors.mutedText,
      fontWeight: "800",
    },

    saveEditButton: {
      flex: 1,
      backgroundColor: colors.coral,
      paddingVertical: 12,
      borderRadius: 14,
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
      backgroundColor: colors.border,
      marginVertical: 16,
    },

    logoutButton: {
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
    },

    logoutButtonText: {
      color: colors.mutedText,
      fontWeight: "800",
      fontSize: 16,
    },

    loginButton: {
      backgroundColor: colors.coral,
      paddingVertical: 14,
      borderRadius: 14,
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
