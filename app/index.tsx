import { View, Text } from 'react-native';
import { useAuth } from '@/context/auth';
import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';

export default function Index() {
  const { isInitialized, isLoggedIn } = useAuth();

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!isInitialized || !navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything
      //  segment is not anything in the auth group.
      !isLoggedIn &&
      !inAuthGroup
    ) {
      // Redirect to the login page.
      router.replace('/login');
    } else if (isLoggedIn) {
      // go to tabs root.
      router.replace('/home');
    }
  }, [segments, navigationState?.key, isInitialized]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {!navigationState?.key ? <ActivityIndicator /> : <></>}
    </View>
  );
}
