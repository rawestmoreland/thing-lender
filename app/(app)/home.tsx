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
import { sendReminderEmail, sendReminderSms } from '@/api/sendReminder';
import { usePocketBase } from '@/context/pocketbase';

export default function Home() {
  const { pb } = usePocketBase();
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [isReminding, setIsReminding] = useState(false);

  const { data, isLoading, error } = useGetLentThings();
  const { mutate: deleteLentThing, isPending: deletingLentThing } =
    useDeleteLentThing();

  const normalizedData = useMemo(() => {
    const normalized = normalizeLentThings(data);

    return normalized;
  }, [data]);

  const handleRemindPress = async (
    type: 'email' | 'sms',
    borrower_id: string,
    thing_id: string
  ) => {
    setSnackBarMessage(null);
    setIsReminding(true);

    switch (type) {
      case 'email':
        const emailResponse = await sendReminderEmail(pb, {
          borrower_id,
          thing_id,
        });
        if (emailResponse.success) {
          setSnackBarMessage('Reminder sent');
        } else {
          setSnackBarMessage(
            emailResponse.message ?? 'Failed to send a reminder'
          );
        }
        break;
      case 'sms':
      default:
        const smsResponse = await sendReminderSms(pb, {
          borrower_id,
          thing_id,
        });
        if (smsResponse.success) {
          setSnackBarMessage('Reminder sent');
        } else {
          setSnackBarMessage(
            smsResponse.message ?? 'Failed to send a reminder'
          );
        }
        break;
    }

    setIsReminding(false);
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
                borrower_id={item.borrower.id}
                thing_id={item.thing.id}
                isLoading={deletingLentThing}
                isReminding={isReminding}
                onReturnedPress={() => deleteLentThing(item.id)}
                onReminderPress={handleRemindPress}
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
