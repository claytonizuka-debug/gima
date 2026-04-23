import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BusinessCardProps = {
  name: string;
  description: string;
  image: string;
  onPress?: () => void;
};

export function BusinessCard({ name, description, image, onPress }: BusinessCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: image }} style={styles.thumbnail} />

      <View style={styles.overlay} />

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
  thumbnail: {
    width: '100%',
    height: 170,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    top: 90,
    backgroundColor: 'rgba(0,0,0,0.08)',
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