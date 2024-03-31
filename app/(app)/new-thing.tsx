import { useGetThingTypes } from '@/hooks/GET/useGetThingTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Button,
  HelperText,
  TextInput,
} from 'react-native-paper';
import { z } from 'zod';
import { PickThingTypeModal } from '@/components/Modals/PickThingTypeModal';
import { TDropdownItem } from '@/components/Modals/AddNewThingModal';
import { useCreateThing } from '@/hooks/CREATE/useCreateThing';
import { useRouter } from 'expo-router';
import Colors from '@/design/Colors';

export default function NewThing() {
  const router = useRouter();

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedThingType, setSelectedThingType] = useState<string | null>(
    null
  );

  const { data: thingTypes, isLoading: thingTypesLoading } = useGetThingTypes();
  const { mutate: createThing, data: newThing, isPending } = useCreateThing();

  const thingTypeOptions: TDropdownItem[] = useMemo(() => {
    if (!thingTypes) return [];

    return (
      thingTypes?.map((type) => ({
        label: type.name,
        value: type.id,
      })) ?? []
    );
  }, [thingTypes]);

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
          onPress={form.handleSubmit(onSubmit)}
        >
          Add
        </Button>
      </View>
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
