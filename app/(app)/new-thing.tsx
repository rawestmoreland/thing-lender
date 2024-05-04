import { useGetThingTypes } from '@/hooks/GET/useGetThingTypes';
import { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { TDropdownItem } from '@/components/Modals/AddNewThingModal';
import { useCreateThing } from '@/hooks/CREATE/useCreateThing';
import Colors from '@/design/Colors';
import { NewThingForm } from '@/components/Forms/NewThingForm';

export default function NewThing() {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedThingType, setSelectedThingType] = useState<string | null>(
    null
  );

  const { data: thingTypes, isLoading: thingTypesLoading } = useGetThingTypes();
  const { mutate: createThing, data: newThing, isPending } = useCreateThing();

  const thingTypeOptions: TDropdownItem[] = useMemo(() => {
    if (!thingTypes) return [];

    return (
      thingTypes
        ?.sort((a, b) => (a.is_last ? 1 : -1))
        .map((type) => ({
          label: type.name,
          value: type.id,
        })) ?? []
    );
  }, [thingTypes]);

  const onFormSubmit = async (data: any) => {
    if (!selectedThingType) return;

    createThing({
      name: data.name,
      thing_type: selectedThingType,
    });
  };

  if (thingTypesLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NewThingForm
        newThing={newThing}
        isPending={isPending}
        thingTypeOptions={thingTypeOptions}
        onFormSubmit={onFormSubmit}
        isPickerVisible={isPickerVisible}
        setIsPickerVisible={setIsPickerVisible}
        selectedThingType={selectedThingType}
        setSelectedThingType={setSelectedThingType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brand.cream,
  },
});
