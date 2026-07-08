import { useRouter } from 'expo-router';
import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import EmployeeForm from '../../components/EmployeeForm';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/expo.icon/lets go.jpg')}
      style={styles.background}
    >
      
      <View style={styles.overlay} />

    
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Mac Donalads</Text>
          <Text style={styles.tagline}>Employee Signup</Text>
        </View>

        <View style={styles.formContainer}>
          <EmployeeForm
            onSuccess={() => router.replace('/auth/login')}
            onCancel={() => router.back()}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024  Mac Donalads. All rights reserved</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 12,
  },
});