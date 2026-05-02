import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useBidaTheme } from "@/hooks/useBidaTheme";

export function SkeletonCard() {
  const colors = useBidaTheme();
  const styles = createStyles(colors);

  const shimmer = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 0.7,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmer]);

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.image, { opacity: shimmer }]} />

      <View style={styles.content}>
        <Animated.View style={[styles.title, { opacity: shimmer }]} />
        <Animated.View style={[styles.line, { opacity: shimmer }]} />
        <Animated.View style={[styles.lineShort, { opacity: shimmer }]} />
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useBidaTheme>) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      marginBottom: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    image: {
      width: "100%",
      height: 170,
      backgroundColor: colors.oceanLight,
    },
    content: {
      padding: 14,
    },
    title: {
      height: 18,
      width: "58%",
      borderRadius: 8,
      backgroundColor: colors.oceanLight,
      marginBottom: 10,
    },
    line: {
      height: 14,
      width: "92%",
      borderRadius: 8,
      backgroundColor: colors.oceanLight,
      marginBottom: 8,
    },
    lineShort: {
      height: 14,
      width: "64%",
      borderRadius: 8,
      backgroundColor: colors.oceanLight,
    },
  });
}
