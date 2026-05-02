import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useSavedBusinesses } from "@/context/SavedBusinessesContext";
import { useBidaTheme } from "@/hooks/useBidaTheme";
import { logOut } from "../../services/authService";
import {
  getRecommendationStatsForUser,
  type RecommendationStats,
} from "../../services/recommendationService";
import {
  getUserProfile,
  updateFullName,
  updateUserPreferences,
  updateUsername,
  type PreferredIsland,
  type PreferredLanguage,
  type UserProfile,
} from "../../services/userService";

const islandOptions: PreferredIsland[] = ["Saipan", "Tinian", "Rota", "Guam"];

const languageOptions: PreferredLanguage[] = [
  "English",
  "Chamorro",
  "Carolinian",
  "Japanese",
  "Korean",
  "Chinese",
];

function getInitials(name: string, email?: string | null) {
  const fallback = email?.split("@")[0] || "Bida User";
  const source = name.trim() || fallback;

  const words = source.replace("@", "").split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function formatMemberSince(createdAt?: string) {
  if (!createdAt) return "Member";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "Member";

  return `Member since ${date.getFullYear()}`;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { savedSlugs } = useSavedBusinesses();
  const colors = useBidaTheme();
  const styles = createStyles(colors);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendationStats, setRecommendationStats] =
    useState<RecommendationStats>({
      received: 0,
      sent: 0,
    });

  const [editingFullName, setEditingFullName] = useState(false);
  const [fullNameInput, setFullNameInput] = useState("");
  const [savingFullName, setSavingFullName] = useState(false);

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  const [preferredIsland, setPreferredIsland] =
    useState<PreferredIsland>("Saipan");
  const [preferredLanguage, setPreferredLanguage] =
    useState<PreferredLanguage>("English");
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setRecommendationStats({ received: 0, sent: 0 });
        return;
      }

      try {
        const [profileData, statsData] = await Promise.all([
          getUserProfile(user.uid),
          getRecommendationStatsForUser(user.uid),
        ]);

        setProfile(profileData);
        setRecommendationStats(statsData);
        setFullNameInput(profileData?.fullName || "");
        setUsernameInput(
          profileData?.username || user.email?.split("@")[0] || "",
        );
        setPreferredIsland(profileData?.preferredIsland || "Saipan");
        setPreferredLanguage(profileData?.preferredLanguage || "English");
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }

    loadProfile();
  }, [user]);

  const displayName = useMemo(() => {
    return profile?.fullName?.trim() || "Add your full name";
  }, [profile?.fullName]);

  const displayUsername = useMemo(() => {
    return profile?.username || user?.email?.split("@")[0] || "user";
  }, [profile?.username, user?.email]);

  const initials = useMemo(() => {
    return getInitials(profile?.fullName || displayUsername, user?.email);
  }, [profile?.fullName, displayUsername, user?.email]);

  async function handleSaveFullName() {
    if (!user) return;

    try {
      setSavingFullName(true);

      const cleanFullName = await updateFullName(user.uid, fullNameInput);

      setProfile((current) =>
        current ? { ...current, fullName: cleanFullName } : current,
      );

      setFullNameInput(cleanFullName);
      setEditingFullName(false);

      Alert.alert("Name updated", "Your full name has been updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update full name.";

      Alert.alert("Could not save name", message);
    } finally {
      setSavingFullName(false);
    }
  }

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

  async function handleSavePreferences() {
    if (!user) return;

    try {
      setSavingPreferences(true);

      const updatedPreferences = await updateUserPreferences(user.uid, {
        preferredIsland,
        preferredLanguage,
      });

      setProfile((current) =>
        current
          ? {
              ...current,
              preferredIsland: updatedPreferences.preferredIsland,
              preferredLanguage: updatedPreferences.preferredLanguage,
            }
          : current,
      );

      Alert.alert("Preferences saved", "Your preferences have been updated.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save preferences.");
    } finally {
      setSavingPreferences(false);
    }
  }

  function handleSendFeedback() {
    const subject = encodeURIComponent("Bida App Feedback");
    const body = encodeURIComponent(
      "Hi Bida team,\n\nI wanted to share this feedback:\n\n",
    );

    Linking.openURL(`mailto:?subject=${subject}&body=${body}`);
  }

  function handleReportProblem() {
    const subject = encodeURIComponent("Bida App Problem Report");
    const body = encodeURIComponent(
      "Hi Bida team,\n\nI found a problem in the app:\n\nWhat happened:\n\nWhat I expected:\n\nDevice:\n\n",
    );

    Linking.openURL(`mailto:?subject=${subject}&body=${body}`);
  }

  function handleDeleteAccountInfo() {
    Alert.alert(
      "Delete account",
      "Account deletion should be added carefully before launch. It needs to remove your Firebase Auth account and related app data safely.",
      [{ text: "OK" }],
    );
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
          Manage your Bida identity, preferences, and account details.
        </Text>
      </View>

      {user ? (
        <>
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={styles.profileHeaderText}>
              <Text
                style={[
                  styles.profileName,
                  !profile?.fullName && styles.placeholderName,
                ]}
              >
                {displayName}
              </Text>

              <Text style={styles.profileUsername}>@{displayUsername}</Text>
              <Text style={styles.memberSince}>
                {formatMemberSince(profile?.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{savedSlugs.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {recommendationStats.received}
              </Text>
              <Text style={styles.statLabel}>Received</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{recommendationStats.sent}</Text>
              <Text style={styles.statLabel}>Sent</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Full Name</Text>

              {!editingFullName ? (
                <Pressable onPress={() => setEditingFullName(true)}>
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              ) : null}
            </View>

            {editingFullName ? (
              <>
                <TextInput
                  style={styles.input}
                  value={fullNameInput}
                  onChangeText={setFullNameInput}
                  placeholder="Full name"
                  placeholderTextColor={colors.mutedText}
                  autoCapitalize="words"
                  autoCorrect={false}
                />

                <View style={styles.editActions}>
                  <Pressable
                    style={styles.cancelEditButton}
                    onPress={() => {
                      setFullNameInput(profile?.fullName || "");
                      setEditingFullName(false);
                    }}
                    disabled={savingFullName}
                  >
                    <Text style={styles.cancelEditButtonText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.saveEditButton,
                      savingFullName && styles.disabledButton,
                    ]}
                    onPress={handleSaveFullName}
                    disabled={savingFullName}
                  >
                    <Text style={styles.saveEditButtonText}>
                      {savingFullName ? "Saving..." : "Save"}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Text
                style={[
                  styles.value,
                  !profile?.fullName && styles.placeholderValue,
                ]}
              >
                {profile?.fullName || "Add your full name"}
              </Text>
            )}

            <View style={styles.divider} />

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
              <Text style={styles.value}>@{displayUsername}</Text>
            )}

            <View style={styles.divider} />

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <Text style={styles.preferenceLabel}>Preferred Island</Text>
            <View style={styles.optionGrid}>
              {islandOptions.map((island) => {
                const selected = preferredIsland === island;

                return (
                  <Pressable
                    key={island}
                    style={[
                      styles.optionPill,
                      selected && styles.optionPillSelected,
                    ]}
                    onPress={() => setPreferredIsland(island)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        selected && styles.optionPillTextSelected,
                      ]}
                    >
                      {island}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.preferenceLabel}>Language</Text>
            <View style={styles.optionGrid}>
              {languageOptions.map((language) => {
                const selected = preferredLanguage === language;

                return (
                  <Pressable
                    key={language}
                    style={[
                      styles.optionPill,
                      selected && styles.optionPillSelected,
                    ]}
                    onPress={() => setPreferredLanguage(language)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        selected && styles.optionPillTextSelected,
                      ]}
                    >
                      {language}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.preferencesButton,
                savingPreferences && styles.disabledButton,
              ]}
              onPress={handleSavePreferences}
              disabled={savingPreferences}
            >
              <Text style={styles.preferencesButtonText}>
                {savingPreferences ? "Saving..." : "Save Preferences"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Actions</Text>

            <Pressable
              style={styles.actionRowItem}
              onPress={handleSendFeedback}
            >
              <View style={styles.actionTextBlock}>
                <Text style={styles.actionTitle}>Send Feedback</Text>
                <Text style={styles.actionSubtitle}>
                  Share ideas to help improve Bida.
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </Pressable>

            <View style={styles.actionDivider} />

            <Pressable
              style={styles.actionRowItem}
              onPress={handleReportProblem}
            >
              <View style={styles.actionTextBlock}>
                <Text style={styles.actionTitle}>Report a Problem</Text>
                <Text style={styles.actionSubtitle}>
                  Tell us if something is not working.
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </Pressable>

            <View style={styles.actionDivider} />

            <Pressable
              style={styles.actionRowItem}
              onPress={handleDeleteAccountInfo}
            >
              <View style={styles.actionTextBlock}>
                <Text style={styles.dangerActionTitle}>Delete Account</Text>
                <Text style={styles.actionSubtitle}>
                  This will be available before launch.
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </Pressable>
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

    profileHeaderCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },

    avatar: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: colors.coral,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      color: "#fff",
      fontSize: 22,
      fontWeight: "900",
      letterSpacing: 0.5,
    },

    profileHeaderText: {
      flex: 1,
    },

    profileName: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.ocean,
      marginBottom: 3,
    },

    placeholderName: {
      color: colors.mutedText,
    },

    profileUsername: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.coral,
      marginBottom: 3,
    },

    memberSince: {
      fontSize: 13,
      color: colors.mutedText,
    },

    statsRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },

    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 8,
      alignItems: "center",
    },

    statNumber: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.ocean,
      marginBottom: 3,
    },

    statLabel: {
      fontSize: 11,
      fontWeight: "800",
      color: colors.mutedText,
      textTransform: "uppercase",
      letterSpacing: 0.4,
      textAlign: "center",
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
      color: colors.ocean,
    },

    placeholderValue: {
      color: colors.mutedText,
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

    sectionTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.ocean,
      marginBottom: 14,
    },

    preferenceLabel: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.mutedText,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      marginBottom: 8,
      marginTop: 4,
    },

    optionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    },

    optionPill: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },

    optionPillSelected: {
      backgroundColor: colors.coral,
      borderColor: colors.coral,
    },

    optionPillText: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.mutedText,
    },

    optionPillTextSelected: {
      color: "#fff",
    },

    preferencesButton: {
      backgroundColor: colors.coral,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 2,
    },

    preferencesButtonText: {
      color: "#fff",
      fontWeight: "900",
      fontSize: 15,
    },

    actionRowItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 4,
      gap: 12,
    },

    actionTextBlock: {
      flex: 1,
    },

    actionTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.ocean,
      marginBottom: 3,
    },

    dangerActionTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: "#DC2626",
      marginBottom: 3,
    },

    actionSubtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.mutedText,
    },

    actionArrow: {
      fontSize: 28,
      color: colors.coral,
      fontWeight: "500",
    },

    actionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 14,
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
