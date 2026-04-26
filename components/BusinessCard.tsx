import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { GimaColors } from '@/constants/gimaTheme';

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
  }, [imageLoaded]);

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
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: GimaColors.card,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: GimaColors.border,
  },
  imageWrapper: {
    width: '100%',
    height: 170,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: GimaColors.card,
  },
  image: {
    width: '100%',
    height: 170,
  },
  textContainer: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: GimaColors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: GimaColors.mutedText,
  },
  inner: {
  overflow: 'hidden',
  borderRadius: 16,
},
});