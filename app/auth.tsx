import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBidaTheme } from "@/hooks/useBidaTheme";
import { logIn, signUp } from "@/services/authService";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBidaTheme();
  const styles = createStyles(colors);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }

    if (!isLogin && cleanPassword !== confirmPassword.trim()) {
      Alert.alert("Passwords do not match", "Please re-enter your password.");
      return;
    }

    try {
      setSubmitting(true);

      if (isLogin) {
        await logIn(cleanEmail, cleanPassword);
      } else {
        await signUp(cleanEmail, cleanPassword);
      }

      router.back();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      Alert.alert(isLogin ? "Login failed" : "Sign up failed", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + 18 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            {isLogin ? "WELCOME BACK" : "JOIN BIDA"}
          </Text>
          <Text style={styles.title}>
            {isLogin ? "Log In" : "Create Account"}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? "Access your saved places, recommendations, and island picks."
              : "Create an account to save places and send recommendations."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.mutedText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {!isLogin ? (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.mutedText}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          ) : null}

          <Pressable
            style={[styles.primaryButton, submitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.primaryButtonText}>
              {submitting
                ? isLogin
                  ? "Logging In..."
                  : "Creating Account..."
                : isLogin
                  ? "Log In"
                  : "Create Account"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => setIsLogin((current) => !current)}
            disabled={submitting}
          >
            <Text style={styles.secondaryButtonText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Log In"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ReturnType<typeof useBidaTheme>) {
  return StyleSheet.create({
    keyboardContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: colors.mutedText,
      marginBottom: 6,
      marginTop: 4,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 13,
      fontSize: 16,
      color: colors.text,
      marginBottom: 14,
    },
    primaryButton: {
      backgroundColor: colors.coral,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 4,
    },
    primaryButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
    },
    secondaryButton: {
      alignItems: "center",
      paddingVertical: 14,
      marginTop: 8,
    },
    secondaryButtonText: {
      color: colors.ocean,
      fontSize: 14,
      fontWeight: "800",
    },
    disabledButton: {
      opacity: 0.65,
    },
  });
}
