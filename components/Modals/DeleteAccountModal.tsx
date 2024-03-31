import { Button, Portal, Dialog, Text } from 'react-native-paper';

export function DeleteAccountModal({
  isOpen,
  onDismiss,
  onDeleteAccount,
  isLoading,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  onDeleteAccount: () => void;
  isLoading: boolean;
}) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={onDismiss}>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Content>
          <Text>
            Are you sure you want to delete your account? This is irrreversible!
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            loading={isLoading}
            disabled={isLoading}
            onPress={onDeleteAccount}
            compact
            style={{ minWidth: 80 }}
            mode='outlined'
          >
            Yes
          </Button>
          <Button
            disabled={isLoading}
            compact
            mode='contained'
            onPress={onDismiss}
          >
            Nevermind
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
