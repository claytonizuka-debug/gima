import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export function SkeletonCard() {
  const shimmerTranslate = useRef(new Animated.Value(-280)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 280,
        duration: 1600, // slower = smoother
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmerTranslate]);

  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.textContainer}>
        <View style={styles.title} />
        <View style={styles.line} />
        <View style={styles.lineShort} />
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmerOverlay,
          { transform: [{ translateX: shimmerTranslate }] }, // no rotation
        ]}
      />
    </View>
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: '#e8e8e8', // softer base
  },
  textContainer: {
    padding: 16,
  },
  title: {
    height: 18,
    width: '60%',
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
    marginBottom: 10,
  },
  line: {
    height: 14,
    width: '90%',
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineShort: {
    height: 14,
    width: '70%',
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120, // narrower
    backgroundColor: 'rgba(255,255,255,0.22)', // toned down
  },
});