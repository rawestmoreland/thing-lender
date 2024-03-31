import { Button, Dialog, Portal, Text } from 'react-native-paper';

export function DeleteThingModal({
  isOpen,
  onDismiss,
  onDeleteThing,
  isLoading,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  onDeleteThing: () => void;
  isLoading: boolean;
}) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={onDismiss}>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Content>
          <Text>This will permanently remove this item.</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            loading={isLoading}
            disabled={isLoading}
            onPress={onDeleteThing}
            compact
            style={{ minWidth: 80 }}
            mode='outlined'
          >
            Yes
          </Button>
          <Button
            disabled={isLoading}
            onPress={onDismiss}
            compact
            style={{ minWidth: 80 }}
            mode='contained'
          >
            Nevermind
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
