import { useSegments, useRouter, useNavigationContainerRef } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { type AuthModel } from 'pocketbase';
import { usePocketBase } from './pocketbase';

type TCreateAccountProps = {
  email: string;
  password: string;
  passwordConfirm: string;
  name?: string;
};

type AuthContextProps = {
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  createAccount: ({
    name,
    email,
    passwordConfirm,
    password,
  }: TCreateAccountProps) => Promise<any>;
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: AuthModel | null;
};

const AuthContext = React.createContext<AuthContextProps>({
  signIn: async () => {
    // no-op
  },
  signOut: async () => {
    // no-op
  },
  createAccount: async () => {
    // no-op
  },
  isLoggedIn: false,
  isInitialized: false,
  user: null,
});

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

function useProtectedRoute(user: AuthModel, isInitialized: boolean) {
  const router = useRouter();
  const segments = useSegments();

  // Check that navigation is all good
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const rootNavRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = rootNavRef?.addListener('state', (event) => {
      setIsNavigationReady(true);
    });
    return function cleanup() {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [rootNavRef.current]);

  useEffect(() => {
    if (!isNavigationReady) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!isInitialized) return;

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(app)/home');
    }
  }, [user, segments, isNavigationReady, isInitialized]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { pb } = usePocketBase();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthModel | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (pb) {
        // Assuming your PocketBase setup includes some method to check auth status
        const isLoggedIn = pb.authStore.isValid;
        setIsLoggedIn(isLoggedIn);
        setUser(isLoggedIn ? pb.authStore.model : null);
        setIsInitialized(true);
      }
    };

    checkAuthStatus();
  }, [pb]);

  const appSignIn = async (email: string, password: string) => {
    if (!pb) return { error: 'PocketBase not initialized' };

    try {
      const resp = await pb
        ?.collection('users')
        .authWithPassword(email, password);
      setUser(pb?.authStore.isValid ? pb.authStore.model : null);
      setIsLoggedIn(pb?.authStore.isValid ?? false);
      return { user: resp?.record };
    } catch (e: any) {
      return { error: e };
    }
  };

  const appSignOut = async () => {
    if (!pb) return { error: 'PocketBase not initialized' };

    try {
      await pb?.authStore.clear();
      setUser(null);
      setIsLoggedIn(false);
      return { user: null };
    } catch (e) {
      return { error: e };
    }
  };

  const createAccount = async ({
    email,
    password,
    passwordConfirm,
    name,
  }: TCreateAccountProps) => {
    if (!pb) return { error: 'PocketBase not initialized' };

    try {
      const resp = await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name,
        is_owner: true,
        is_borrower: false,
      });

      // Unsuccessful response throws, so we should be fine here
      await pb.collection('users').requestVerification(email);

      return { user: resp?.record };
    } catch (e: any) {
      return { error: e.response };
    }
  };

  useProtectedRoute(user, isInitialized);

  return (
    <AuthContext.Provider
      value={{
        signIn: (email: string, password: string) => appSignIn(email, password),
        signOut: () => appSignOut(),
        createAccount: ({
          email,
          password,
          passwordConfirm,
          name,
        }: TCreateAccountProps) =>
          createAccount({ email, password, passwordConfirm, name }),
        isLoggedIn,
        isInitialized,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
