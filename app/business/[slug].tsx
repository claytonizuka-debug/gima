import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
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

import {
  getBusinessBySlug,
  type Business,
} from "../../services/businessService";
import { sendRecommendation } from "../../services/recommendationService";
import { getUserByUsername } from "../../services/userService";

export default function BusinessDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const { user } = useAuth();
  const { toggleSaved, isSaved, loading: savedLoading } = useSavedBusinesses();
  const colors = useBidaTheme();
  const styles = createStyles(colors);

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const [recommendModalVisible, setRecommendModalVisible] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState("");
  const [message, setMessage] = useState("");
  const [sendingRecommendation, setSendingRecommendation] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      if (!slug) {
        setBusiness(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getBusinessBySlug(slug);
        setBusiness(data);
      } catch (error) {
        console.error("Error loading business:", error);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    }

    loadBusiness();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading business...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Business not found</Text>
        <Text style={styles.emptyText}>
          We could not find information for this business.
        </Text>
      </View>
    );
  }

  const safeBusiness = business;
  const businessSlug = safeBusiness.slug;
  const saved = isSaved(businessSlug);

  async function handleSave() {
    if (!user) {
      router.push("/auth");
      return;
    }

    await toggleSaved(businessSlug);
  }

  function handleOpenRecommendModal() {
    if (!user || !user.email) {
      Alert.alert("Login required", "Please log in to send recommendations.", [
        { text: "Go to Login", onPress: () => router.push("/auth") },
      ]);
      return;
    }

    setRecipientUsername("");
    setMessage("");
    setRecommendModalVisible(true);
  }

  async function handleSend() {
    if (!user || !user.email) return;

    const fromEmail = user.email;
    const cleanUsername = recipientUsername
      .trim()
      .replace("@", "")
      .toLowerCase();
    const cleanMessage = message.trim();

    if (!cleanUsername) {
      Alert.alert("Missing username", "Please enter a username.");
      return;
    }

    try {
      setSendingRecommendation(true);

      const targetUser = await getUserByUsername(cleanUsername);

      if (!targetUser) {
        Alert.alert("User not found", "No account exists with that username.");
        return;
      }

      if (targetUser.uid === user.uid) {
        Alert.alert("Invalid", "You cannot recommend a business to yourself.");
        return;
      }

      await sendRecommendation({
        toUserId: targetUser.uid,
        businessSlug,
        fromUserId: user.uid,
        fromEmail,
        message: cleanMessage,
      });

      setRecommendModalVisible(false);
      setRecipientUsername("");
      setMessage("");

      Alert.alert(
        "Sent",
        `${safeBusiness.name} was sent to @${targetUser.username}.`,
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send recommendation.");
    } finally {
      setSendingRecommendation(false);
    }
  }

  function handleOpenMaps() {
    const hasCoordinates =
      typeof safeBusiness.lat === "number" &&
      typeof safeBusiness.lng === "number";

    if (hasCoordinates) {
      const label = encodeURIComponent(safeBusiness.name);

      const url =
        Platform.OS === "ios"
          ? `http://maps.apple.com/?ll=${safeBusiness.lat},${safeBusiness.lng}&q=${label}`
          : `geo:${safeBusiness.lat},${safeBusiness.lng}?q=${safeBusiness.lat},${safeBusiness.lng}(${label})`;

      Linking.openURL(url);
      return;
    }

    const destination = encodeURIComponent(
      `${safeBusiness.name} ${safeBusiness.location} Saipan CNMI`,
    );

    Alert.alert("Open Maps", "Choose an app", [
      {
        text: "Apple Maps",
        onPress: () => {
          Linking.openURL(`http://maps.apple.com/?q=${destination}`);
        },
      },
      {
        text: "Google Maps",
        onPress: () => {
          Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${destination}`,
          );
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }

  function handleCallBusiness() {
    if (!safeBusiness.phone) return;
    Linking.openURL(`tel:${safeBusiness.phone}`);
  }

  function handleOpenWebsite() {
    if (!safeBusiness.website) return;

    const websiteUrl = safeBusiness.website.startsWith("http")
      ? safeBusiness.website
      : `https://${safeBusiness.website}`;

    Linking.openURL(websiteUrl);
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: safeBusiness.image }} style={styles.image} />

        <View style={styles.metaRow}>
          <Text style={styles.categoryPill}>{safeBusiness.category}</Text>
          <Text style={styles.statusPill}>{safeBusiness.status}</Text>
        </View>

        <Text style={styles.title}>{safeBusiness.name}</Text>
        <Text style={styles.description}>{safeBusiness.description}</Text>

        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              saved && styles.savedButton,
              pressed && styles.pressedButton,
            ]}
            onPress={handleSave}
            disabled={savedLoading}
          >
            <Text
              style={[styles.saveButtonText, saved && styles.savedButtonText]}
            >
              {saved ? "Saved" : "Save"}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.recommendButton,
              pressed && styles.pressedButton,
            ]}
            onPress={handleOpenRecommendModal}
          >
            <Text style={styles.recommendButtonText}>Recommend</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Hours</Text>
          <Text style={styles.infoText}>{safeBusiness.hours}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.infoText}>{safeBusiness.location}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.directionsButton,
              pressed && styles.pressedButton,
            ]}
            onPress={handleOpenMaps}
          >
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{safeBusiness.category}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>
              {safeBusiness.priceRange || "Not listed"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>
              {safeBusiness.phone || "Not listed"}
            </Text>
          </View>

          <View style={styles.detailRowLast}>
            <Text style={styles.detailLabel}>Website</Text>
            <Text style={styles.detailValue}>
              {safeBusiness.website || "Not listed"}
            </Text>
          </View>

          <View style={styles.detailButtonRow}>
            {safeBusiness.phone ? (
              <Pressable
                style={({ pressed }) => [
                  styles.utilityButton,
                  pressed && styles.pressedButton,
                ]}
                onPress={handleCallBusiness}
              >
                <Text style={styles.utilityButtonText}>Call</Text>
              </Pressable>
            ) : null}

            {safeBusiness.website ? (
              <Pressable
                style={({ pressed }) => [
                  styles.utilityButton,
                  pressed && styles.pressedButton,
                ]}
                onPress={handleOpenWebsite}
              >
                <Text style={styles.utilityButtonText}>Website</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <Modal visible={recommendModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Recommend {safeBusiness.name}</Text>
            <Text style={styles.modalSubtitle}>
              Send this place to another Bida user.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={colors.mutedText}
              autoCapitalize="none"
              value={recipientUsername}
              onChangeText={setRecipientUsername}
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message (optional)"
              placeholderTextColor={colors.mutedText}
              value={message}
              onChangeText={setMessage}
              multiline
            />

            <Pressable
              style={({ pressed }) => [
                styles.modalPrimaryButton,
                sendingRecommendation && styles.disabledButton,
                pressed && styles.pressedButton,
              ]}
              onPress={handleSend}
              disabled={sendingRecommendation}
            >
              <Text style={styles.modalPrimaryButtonText}>
                {sendingRecommendation ? "Sending..." : "Send"}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressedLightButton,
              ]}
              onPress={() => {
                setRecommendModalVisible(false);
                setRecipientUsername("");
                setMessage("");
              }}
              disabled={sendingRecommendation}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function createStyles(colors: ReturnType<typeof useBidaTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      padding: 20,
      paddingBottom: 110,
    },

    image: {
      width: "100%",
      height: 240,
      borderRadius: 22,
      marginBottom: 16,
      backgroundColor: colors.card,
    },

    metaRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
    },

    categoryPill: {
      backgroundColor: colors.card,
      color: colors.coral,
      overflow: "hidden",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: "800",
      borderWidth: 1,
      borderColor: colors.border,
    },

    statusPill: {
      backgroundColor: colors.leaf,
      color: "#fff",
      overflow: "hidden",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: "800",
    },

    title: {
      fontSize: 30,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 8,
    },

    description: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.mutedText,
      marginBottom: 14,
    },

    actionRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },

    saveButton: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.coral,
      paddingVertical: 13,
      borderRadius: 14,
      alignItems: "center",
    },

    savedButton: {
      backgroundColor: colors.leaf,
      borderColor: colors.leaf,
    },

    saveButtonText: {
      color: colors.coral,
      fontWeight: "900",
    },

    savedButtonText: {
      color: "#fff",
    },

    recommendButton: {
      flex: 1,
      backgroundColor: colors.coral,
      paddingVertical: 13,
      borderRadius: 14,
      alignItems: "center",
    },

    recommendButtonText: {
      color: "#fff",
      fontWeight: "900",
    },

    pressedButton: {
      opacity: 0.78,
      transform: [{ scale: 0.98 }],
    },

    pressedLightButton: {
      opacity: 0.6,
    },

    infoCard: {
      backgroundColor: colors.card,
      padding: 18,
      borderRadius: 22,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },

    label: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.mutedText,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },

    infoText: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
    },

    directionsButton: {
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.coral,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 12,
    },

    directionsButtonText: {
      color: colors.coral,
      fontWeight: "900",
    },

    detailRow: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 10,
    },

    detailRowLast: {
      paddingVertical: 10,
    },

    detailLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.mutedText,
      marginBottom: 3,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },

    detailValue: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 21,
    },

    detailButtonRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8,
    },

    utilityButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.coral,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
    },

    utilityButtonText: {
      color: colors.coral,
      fontWeight: "900",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.65)",
      justifyContent: "center",
      padding: 20,
    },

    modalCard: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
    },

    modalTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 6,
    },

    modalSubtitle: {
      fontSize: 15,
      color: colors.mutedText,
      marginBottom: 14,
    },

    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
    },

    messageInput: {
      height: 90,
      textAlignVertical: "top",
    },

    modalPrimaryButton: {
      backgroundColor: colors.coral,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      marginBottom: 10,
    },

    modalPrimaryButtonText: {
      color: "#fff",
      fontWeight: "900",
    },

    cancelButton: {
      alignItems: "center",
      paddingVertical: 8,
      borderRadius: 10,
    },

    cancelButtonText: {
      color: colors.mutedText,
      fontWeight: "700",
    },

    disabledButton: {
      opacity: 0.65,
    },

    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },

    loadingText: {
      color: colors.mutedText,
    },

    emptyContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.text,
      marginBottom: 8,
    },

    emptyText: {
      color: colors.mutedText,
      textAlign: "center",
    },
  });
}
