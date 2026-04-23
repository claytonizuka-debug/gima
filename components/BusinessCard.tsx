import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type BusinessCardProps = {
  name: string;
  description: string;
  image: string;
  onPress?: () => void;
};

export function BusinessCard({ name, description, image, onPress }: BusinessCardProps) {
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <Animated.View
          pointerEvents="none"
          style={[styles.imagePlaceholder, { opacity: placeholderOpacity }]}
        />

        <Animated.Image
          source={{ uri: image }}
          style={[styles.thumbnail, { opacity: imageOpacity }]}
          onLoad={() => setImageLoaded(true)}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.businessName}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  imageWrapper: {
    width: '100%',
    height: 170,
    backgroundColor: '#f1f1f1',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e5e5e5',
  },
  thumbnail: {
    width: '100%',
    height: 170,
  },
  textContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});