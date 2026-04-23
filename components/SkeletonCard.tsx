import { StyleSheet, View } from 'react-native';

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />

      <View style={styles.textContainer}>
        <View style={styles.title} />
        <View style={styles.line} />
        <View style={styles.lineShort} />
      </View>
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
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: '#e5e5e5',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    height: 18,
    width: '60%',
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
    marginBottom: 10,
  },
  line: {
    height: 14,
    width: '90%',
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineShort: {
    height: 14,
    width: '70%',
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
  },
});