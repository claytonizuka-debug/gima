import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function SkeletonCard() {
  const shimmerTranslate = useRef(new Animated.Value(-320)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 320,
        duration: 1500,
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

      <AnimatedLinearGradient
        pointerEvents="none"
        colors={['transparent', 'rgba(255,255,255,0.35)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.shimmerOverlay,
          { transform: [{ translateX: shimmerTranslate }] },
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
    backgroundColor: '#ececec',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    height: 18,
    width: '60%',
    backgroundColor: '#ececec',
    borderRadius: 6,
    marginBottom: 10,
  },
  line: {
    height: 14,
    width: '90%',
    backgroundColor: '#ececec',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineShort: {
    height: 14,
    width: '70%',
    backgroundColor: '#ececec',
    borderRadius: 6,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 180,
  },
});