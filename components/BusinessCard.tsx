import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BusinessCardProps = {
  name: string;
  description: string;
  image: string;
  onPress?: () => void;
};

export function BusinessCard({ name, description, image, onPress }: BusinessCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.thumbnail} />

      <View style={styles.textContainer}>
        <Text style={styles.businessName}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 140,
  },
  textContainer: {
    padding: 14,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});