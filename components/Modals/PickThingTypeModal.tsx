import { TThingType } from '@/lib/types/pocketbase';
import { TDropdownItem } from './AddNewThingModal';
import { Picker } from '@react-native-picker/picker';
import { Button, Modal, Portal } from 'react-native-paper';
import { useMemo } from 'react';

export function PickThingTypeModal({
  isOpen,
  onDismiss,
  thingTypes,
  selectedThingType,
  setSelectedThingType,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  thingTypes: TDropdownItem[];
  selectedThingType: string | null;
  setSelectedThingType: (value: string | null) => void;
}) {
  const thingTypeText = useMemo(() => {
    if (!selectedThingType) return thingTypes[0]?.label;
    return thingTypes.find((t) => t.value === selectedThingType)?.label;
  }, [selectedThingType]);

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
        <Picker
          selectedValue={selectedThingType}
          onValueChange={(itemValue, _itemIndex) =>
            setSelectedThingType(itemValue)
          }
        >
          {thingTypes?.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
        <Button
          onPress={onDismiss}
          mode='contained'
        >{`Select ${thingTypeText}`}</Button>
      </Modal>
    </Portal>
  );
}
