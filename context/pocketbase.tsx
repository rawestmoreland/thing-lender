import React, { createContext, useContext, useState, useEffect } from 'react';
import PocketBase, { AsyncAuthStore } from 'pocketbase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Client from 'pocketbase';

const PocketBaseContext = createContext<{ pb: Client | null }>({
  pb: null,
});

export const usePocketBase = () => useContext(PocketBaseContext);

export const PocketBaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pb, setPb] = useState<Client | null>(null);

  useEffect(() => {
    const initializePocketBase = async () => {
      const store = new AsyncAuthStore({
        save: async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
        // @ts-ignore
        initial: await AsyncStorage.getItem('pb_auth'),
        clear: async () => AsyncStorage.removeItem('pb_auth'),
      });
      const pbInstance = new PocketBase('https://thing-lender.fly.dev', store);
      setPb(pbInstance);
    };

    initializePocketBase();
  }, []);

  return (
    <PocketBaseContext.Provider value={{ pb }}>
      {children}
    </PocketBaseContext.Provider>
  );
};
