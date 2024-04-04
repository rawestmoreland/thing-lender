import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal, Snackbar } from 'react-native-paper';

import { useGetBorrowerById } from '@/hooks/GET/useGetBorrowerById';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/design/Colors';
import { NewBorrowerForm } from '@/components/Forms/NewBorrowerForm';
import { useUpdateBorrower } from '@/hooks/UPDATE/useUpdateBorrower';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

export default function Borrower() {
  const router = useRouter();
  const { id }: { id: string } = useLocalSearchParams();
  const { data: borrowerData, isLoading: borrowerLoading } =
    useGetBorrowerById(id);

  const {
    mutate: updateBorrower,
    data: newBorrower,
    isPending: updatingBorrower,
    error: updateError,
  } = useUpdateBorrower(id);

  const [snackMessage, setSnackMessage] = useState('');

  const onFormSubmit = async (data: any) => {
    const { name, email, phone: phone_number } = data;

    updateBorrower({ name, email, phone_number });
  };

  useEffect(() => {
    if (!newBorrower) return;

    router.back();
  }, [newBorrower]);

  useEffect(() => {
    if (!updateError) {
      setSnackMessage('');
    } else {
      if (!isEmpty(updateError?.data?.data.email)) {
        setSnackMessage("This borrower's email already exists");
      } else {
        setSnackMessage('Error creating this borrower.');
      }
    }
  }, [updateError]);

  if (borrowerLoading || !borrowerData) {
    <View style={styles.container}>
      <ActivityIndicator />
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NewBorrowerForm
        editing
        borrowerData={borrowerData}
        onFormSubmit={onFormSubmit}
        isLoading={updatingBorrower}
      />
      <Portal>
        <Snackbar
          visible={Boolean(snackMessage)}
          onDismiss={() => setSnackMessage('')}
        >
          {snackMessage}
        </Snackbar>
      </Portal>
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
});
