import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText, Button } from 'react-native-paper';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import { PickThingTypeModal } from '../Modals/PickThingTypeModal';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { TDropdownItem } from '../Modals/AddNewThingModal';
import { RecordModel } from 'pocketbase';
import Colors from '@/design/Colors';

export function NewThingForm({
  editing = false,
  thingData,
  newThing,
  isPending,
  isPickerVisible,
  setIsPickerVisible,
  selectedThingType,
  setSelectedThingType,
  thingTypeOptions,
  onFormSubmit,
}: {
  editing?: boolean;
  thingData?: RecordModel | undefined;
  newThing: RecordModel | undefined;
  isPending: boolean;
  isPickerVisible: boolean;
  setIsPickerVisible: (isVisible: boolean) => void;
  selectedThingType: string | null;
  setSelectedThingType: (thingType: string | null) => void;
  thingTypeOptions: TDropdownItem[];
  onFormSubmit: (data: any) => void;
}) {
  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(40, 'Name must be at most 40 characters long'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (!newThing) return;

    form.reset({ name: '' });
    setSelectedThingType(null);

    router.back();
  }, [newThing]);

  useEffect(() => {
    if (!thingData) return;

    form.reset({ name: thingData.name });
  }, [thingData]);

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Controller
          control={form.control}
          name='name'
          render={({ field }) => (
            <TextInput
              dense
              mode='outlined'
              label='Thing name'
              value={field.value}
              onChangeText={field.onChange}
              error={Boolean(form.formState.errors.name)}
            />
          )}
        />
        {form.formState.errors.name && (
          <HelperText
            type='error'
            visible={Boolean(form.formState.errors.name)}
          >
            {form.formState.errors.name?.message}
          </HelperText>
        )}
      </View>
      <Button
        onPress={() => setIsPickerVisible(!isPickerVisible)}
        mode='outlined'
        style={{ marginTop: 8 }}
      >
        {selectedThingType
          ? `Type: ${
              thingTypeOptions?.find((i) => i.value === selectedThingType)
                ?.label
            }`
          : 'Select thing type'}
      </Button>
      <PickThingTypeModal
        isOpen={isPickerVisible}
        onDismiss={() => setIsPickerVisible(false)}
        thingTypes={thingTypeOptions}
        setSelectedThingType={setSelectedThingType}
        selectedThingType={selectedThingType}
      />
      <Button
        loading={isPending || form.formState.isSubmitting}
        style={{ marginTop: 8 }}
        mode='contained'
        disabled={
          !Boolean(form.formState.isValid) ||
          !selectedThingType ||
          form.formState.isSubmitting ||
          isPending
        }
        onPress={form.handleSubmit(onFormSubmit)}
      >
        Add
      </Button>
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
  formContainer: {
    width: '80%',
  },
  inputGroup: {
    gap: 8,
  },
});
