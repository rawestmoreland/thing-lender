import { RecordModel } from 'pocketbase';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Portal, Modal, TextInput, Button } from 'react-native-paper';

export type TDropdownItem = {
  value: string | undefined;
  label: string | undefined;
};

export function AddNewThingModal({
  isOpen,
  onDismiss,
  onAddThing,
  thingTypes,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  onAddThing: ({
    name,
    thing_type,
  }: {
    name: string;
    thing_type: string;
  }) => void;
  thingTypes: RecordModel[];
}) {
  const [thingName, setThingName] = useState('');
  const [thingType, setThingType] = useState<TDropdownItem | null>(null);

  const dropdownThingTypes = thingTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

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
          label='Thing name'
          dense
          value={thingName}
          onChangeText={setThingName}
          mode='outlined'
          style={{ marginBottom: 8 }}
        />
        <Dropdown
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            padding: 4,
            borderRadius: 4,
          }}
          data={dropdownThingTypes}
          onChange={setThingType}
          value={thingType}
          labelField='label'
          valueField='value'
        />
        <Button
          disabled={!thingName}
          mode='contained'
          onPress={() => {
            if (thingType) {
              onAddThing({
                name: thingName,
                thing_type: thingType?.value,
              });
              setThingName('');
              setThingType(null);
              onDismiss();
            }
          }}
          style={{ marginTop: 8 }}
        >
          Add
        </Button>
      </Modal>
    </Portal>
  );
}
