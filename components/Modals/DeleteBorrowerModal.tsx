import { Button, Portal, Dialog, Text } from 'react-native-paper';

export function DeleteBorrowerModal({
  isOpen,
  onDismiss,
  onDeleteBorrower,
  isLoading,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  onDeleteBorrower: () => void;
  isLoading: boolean;
}) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={onDismiss}>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Content>
          <Text>
            Are you sure you want to delete this borrower? This is
            irrreversible!
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            loading={isLoading}
            disabled={isLoading}
            onPress={onDeleteBorrower}
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
