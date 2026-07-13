import { Stack } from 'expo-router';
import { useState } from 'react';

import SimpleSplash from '@/components/simple-splash';
import { AuthProvider, useAuth } from '@/hooks/use-auth';

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SimpleSplash onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* only mount the tabs when logged in */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
      </Stack.Protected>

      {/* only mount the auth screens when logged out */}
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
