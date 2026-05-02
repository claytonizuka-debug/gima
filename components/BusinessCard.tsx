import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useBidaTheme } from "@/hooks/useBidaTheme";

type BusinessCardProps = {
  name: string;
  description: string;
  image: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BusinessCard({
  name,
  description,
  image,
  onPress,
  style,
}: BusinessCardProps) {
  const colors = useBidaTheme();
  const styles = createStyles(colors);

  const [imageLoaded, setImageLoaded] = useState(false);

  const placeholderOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (imageLoaded) {
      Animated.parallel([
        Animated.timing(placeholderOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [imageLoaded, placeholderOpacity, imageOpacity]);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.inner}>
        <View style={styles.imageWrapper}>
          <Animated.View
            pointerEvents="none"
            style={[styles.placeholder, { opacity: placeholderOpacity }]}
          />

          <Animated.Image
            source={{ uri: image }}
            style={[styles.image, { opacity: imageOpacity }]}
            onLoad={() => setImageLoaded(true)}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function createStyles(colors: ReturnType<typeof useBidaTheme>) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    inner: {
      overflow: "hidden",
      borderRadius: 18,
    },
    imageWrapper: {
      width: "100%",
      height: 170,
      overflow: "hidden",
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      backgroundColor: colors.oceanLight,
    },
    placeholder: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.oceanLight,
    },
    image: {
      width: "100%",
      height: 170,
    },
    textContainer: {
      padding: 14,
    },
    name: {
      fontSize: 17,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 6,
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.mutedText,
    },
  });
}
