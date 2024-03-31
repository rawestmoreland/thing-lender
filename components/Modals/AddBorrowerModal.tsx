import { AuthModel } from 'pocketbase';
import { useState } from 'react';
import { Portal, Modal, TextInput, Button } from 'react-native-paper';

export function AddBorrowerModal({
  isOpen,
  onDismiss,
  onAddBorrower,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  onAddBorrower: ({
    name,
    phone_number,
    email,
  }: {
    name: string;
    phone_number?: string;
    email?: string;
  }) => void;
}) {
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerPhone, setBorrowerPhone] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');

  return (
    <Portal>
      <Modal
        visible={isOpen}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 16,
          width: '75%',
          alignSelf: 'center',
          borderRadius: 8,
        }}
      >
        <TextInput
          label='Borrower name'
          dense
          value={borrowerName}
          onChangeText={setBorrowerName}
          mode='outlined'
          style={{ marginBottom: 8 }}
        />
        <TextInput
          label='Borrower phone'
          dense
          keyboardType='number-pad'
          value={borrowerPhone}
          onChangeText={setBorrowerPhone}
          mode='outlined'
          style={{ marginBottom: 8 }}
        />
        <TextInput
          label='Borrower email'
          dense
          autoCapitalize='none'
          value={borrowerEmail}
          onChangeText={setBorrowerEmail}
          keyboardType='email-address'
          mode='outlined'
          style={{ marginBottom: 8 }}
        />
        <Button
          disabled={!(borrowerName && borrowerEmail)}
          mode='contained'
          onPress={() => {
            onAddBorrower({
              name: borrowerName,
              phone_number: borrowerPhone,
              email: borrowerEmail,
            });
            setBorrowerName('');
            setBorrowerPhone('');
            setBorrowerEmail('');
            onDismiss();
          }}
          style={{ marginTop: 8 }}
        >
          Add
        </Button>
      </Modal>
    </Portal>
  );
}
