import { Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import SimpleSplash from '@/components/simple-splash';
import { AuthProvider, useAuth } from '@/hooks/use-auth';

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SimpleSplash onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
    
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
      </Stack.Protected>

     
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="auth" options={{ animation: 'none' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
