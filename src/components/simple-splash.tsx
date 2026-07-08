import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SimpleSplashProps {
  onFinish: () => void;
}

export default function SimpleSplash({ onFinish }: SimpleSplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Mac Donalds</Text>
      <Text style={styles.tagline}>Employee Management</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#e0e0ff',
  },
});
