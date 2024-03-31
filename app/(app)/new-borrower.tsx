import { NewBorrowerForm } from '@/components/Forms/NewBorrowerForm';
import Colors from '@/design/Colors';
import { useCreateBorrower } from '@/hooks/CREATE/useCreateBorrower';
import { useRouter } from 'expo-router';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';

export default function NewBorrower() {
  const router = useRouter();

  const [snackMessage, setSnackMessage] = useState('');

  const {
    mutate: createBorrower,
    isPending: creatingBorrower,
    data: newBorrower,
    error: borrowerError,
  } = useCreateBorrower();

  useEffect(() => {
    if (!newBorrower) return;

    router.back();
  }, [newBorrower]);

  useEffect(() => {
    if (!borrowerError) {
      setSnackMessage('');
    } else {
      if (!isEmpty(borrowerError?.data?.data.email)) {
        setSnackMessage("This borrower's email already exists");
      } else {
        setSnackMessage('Error creating this borrower.');
      }
    }
  }, [borrowerError]);

  const onFormSubmit = (data: any) => {
    const { name, email, phone: phone_number } = data;

    createBorrower({ name, email, phone_number });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NewBorrowerForm
        isLoading={creatingBorrower}
        onFormSubmit={onFormSubmit}
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
