import { SafeAreaView, StyleSheet, View } from 'react-native';

import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { useAuth } from '@/context/auth';
import { useState } from 'react';
import { useDeleteAccount } from '@/hooks/DELETE/useDeleteAccount';
import Colors from '@/design/Colors';
import { DeleteAccountModal } from '@/components/Modals/DeleteAccountModal';

export default function Settings() {
  const { signOut } = useAuth();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const [isDeleteAccountDialogVisible, setIsDeleteAccountDialogVisible] =
    useState(false);

  const dismissDeleteAccountDialog = () =>
    setIsDeleteAccountDialogVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button mode='contained' icon='logout' onPress={signOut}>
          Log out
        </Button>
        <Button
          onPress={() => setIsDeleteAccountDialogVisible(true)}
          buttonColor='red'
          mode='contained'
          icon='alert-outline'
        >
          Delete account
        </Button>
      </View>
      <DeleteAccountModal
        isOpen={isDeleteAccountDialogVisible}
        onDismiss={dismissDeleteAccountDialog}
        onDeleteAccount={deleteAccount}
        isLoading={isPending}
      />
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
  buttonContainer: {
    gap: 8,
  },
});
