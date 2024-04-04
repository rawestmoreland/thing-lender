import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import { useGetLentThings } from '@/hooks/GET/useGetLentThings';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Portal, Snackbar, Text } from 'react-native-paper';
import { LentThingCard } from '@/components/LentThingCard';
import { normalizeLentThings } from '@/lib/utils/normalizeLentThings';
import { usePathname, useRouter } from 'expo-router';
import { FloatingMenu } from '@/components/FloatingMenu';
import { useAuth } from '@/context/auth';
import Colors from '@/design/Colors';
import { useDeleteLentThing } from '@/hooks/DELETE/useDeleteLentThing';
import { sendReminder } from '@/api/sendReminder';
import { usePocketBase } from '@/context/pocketbase';

export default function Home() {
  const { pb } = usePocketBase();
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const { data, isLoading, error } = useGetLentThings();
  const { mutate: deleteLentThing, isPending: deletingLentThing } =
    useDeleteLentThing();

  const normalizedData = useMemo(() => {
    const normalized = normalizeLentThings(data);

    return normalized;
  }, [data]);

  const handleRemindPress = async (borrower_id: string, thing_id: string) => {
    setSnackBarMessage(null);
    setIsLoadingState(true);
    const response = await sendReminder(pb, { borrower_id, thing_id });

    if (response.success) {
      setSnackBarMessage('Reminder sent');
    } else {
      setSnackBarMessage(response.message ?? 'Failed to send a reminder');
    }

    setIsLoadingState(false);
  };

  if (isLoading)
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {!Boolean(normalizedData.length) ? (
        <View style={{ width: '80%' }}>
          <Text
            variant='headlineMedium'
            style={{ fontWeight: '600', textAlign: 'center' }}
          >
            No items on loan
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ width: '100%' }}
          data={normalizedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <LentThingCard
                isLoading={deletingLentThing || isLoadingState}
                onReturnedPress={() => deleteLentThing(item.id)}
                onReminderPress={() =>
                  handleRemindPress(item.borrower.id, item.thing.id)
                }
                thingName={item.thing.name}
                borrower={item.borrower.name}
                dueDate={item.dueDate}
                pastDue={item.pastDue}
                thingType={item.thingType}
              />
            );
          }}
        />
      )}
      <Portal>
        <Snackbar
          visible={Boolean(snackBarMessage)}
          onDismiss={() => setSnackBarMessage(null)}
          style={{ marginBottom: 80 }}
        >
          {snackBarMessage}
        </Snackbar>
      </Portal>
      {isLoggedIn && (
        <FloatingMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          router={router}
          pathname={pathname}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.cream,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
