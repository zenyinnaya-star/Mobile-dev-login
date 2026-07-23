import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/hooks/use-auth';

export default function WelcomeScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome Employee</Text>
      <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
        <Text style={styles.profileText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileBtn: {
    marginTop: 24,
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  profileText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: '#111827',
    fontWeight: '600',
  },
});
