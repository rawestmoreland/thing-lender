import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal, Snackbar } from 'react-native-paper';

import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/design/Colors';
import { isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useGetThingById } from '@/hooks/GET/useGetThingById';
import { useUpdateThing } from '@/hooks/UPDATE/useUpdateThing';
import { NewThingForm } from '@/components/Forms/NewThingForm';
import { useGetThingTypes } from '@/hooks/GET/useGetThingTypes';
import { TDropdownItem } from '@/components/Modals/AddNewThingModal';

export default function Thing() {
  const router = useRouter();
  const { id }: { id: string } = useLocalSearchParams();
  const { data: thingData, isLoading: thingLoading } = useGetThingById(id);
  const { data: thingTypes, isLoading: thingTypesLoading } = useGetThingTypes();

  const {
    mutate: updateThing,
    data: newThing,
    isPending: updatingThing,
    error: updateError,
  } = useUpdateThing(id);

  const [snackMessage, setSnackMessage] = useState('');

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedThingType, setSelectedThingType] = useState<string | null>(
    null
  );

  const thingTypeOptions: TDropdownItem[] = useMemo(() => {
    if (!thingTypes) return [];

    return (
      thingTypes?.map((type) => ({
        label: type.name,
        value: type.id,
      })) ?? []
    );
  }, [thingTypes]);

  const onFormSubmit = async (data: any) => {
    const { name, thing_type } = data;

    updateThing({ name, thing_type });
  };

  useEffect(() => {
    if (!newThing) return;

    router.back();
  }, [newThing]);

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

  useEffect(() => {
    if (thingData) {
      console.log(thingData);
      setSelectedThingType(thingData.thing_type);
    }
  }, [thingData]);

  if (thingLoading || thingTypesLoading || !thingData) {
    <View style={styles.container}>
      <ActivityIndicator />
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NewThingForm
        editing
        thingData={thingData}
        isPending={updatingThing}
        onFormSubmit={onFormSubmit}
        isPickerVisible={isPickerVisible}
        setIsPickerVisible={setIsPickerVisible}
        selectedThingType={selectedThingType}
        setSelectedThingType={setSelectedThingType}
        newThing={newThing}
        thingTypeOptions={thingTypeOptions}
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
