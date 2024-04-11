import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewBorrowerForm as BorrowerForm,
  TCountryCode,
} from '../Modals/LoanThingModal';
import {
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { RecordModel } from 'pocketbase';
import parsePhoneNumber, { CountryCode, PhoneNumber } from 'libphonenumber-js';
import { isValidPhoneNumber } from '@/lib/utils/phoneNumbers';

export function NewBorrowerForm({
  editing = false,
  borrowerData,
  onFormSubmit,
  isLoading,
}: {
  editing?: boolean;
  borrowerData?: RecordModel | undefined;
  onFormSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [CCPickerOpen, setCCPickerOpen] = useState(false);
  const [countryCode, setCountryCode] = useState<TCountryCode>({
    code: 'US',
    dial_code: '+1',
    flag: '🇺🇸',
  });

  const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Must be a valid email'),
    phone: z
      .string()
      .min(2, 'Phone number must be at least 2 characters long')
      .or(z.literal(''))
      .transform((val, ctx) => {
        if (!val) return '';

        const parsedPhone = parsePhoneNumber(
          val,
          countryCode.code as CountryCode
        );

        if (!parsedPhone || !isValidPhoneNumber(parsedPhone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['phone'],
            message: 'Invalid phone number',
          });

          return z.NEVER;
        }

        return parsedPhone.number;
      }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: borrowerData?.name ?? '',
      email: borrowerData?.email ?? '',
      phone: borrowerData?.phone_number ?? '',
    },
  });

  useEffect(() => {
    if (!borrowerData) return;

    form.reset({
      name: borrowerData.name,
      email: borrowerData.email,
      phone: borrowerData.phone_number,
    });
  }, [borrowerData]);

  if (editing && (isLoading || !borrowerData))
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ padding: 24, width: '80%', gap: 8 }}>
        <BorrowerForm
          setCountryCode={setCountryCode}
          countryCode={countryCode}
          setCCPickerOpen={setCCPickerOpen}
          form={form}
          CCPickerOpen={CCPickerOpen}
        />
        <Button
          loading={isLoading}
          disabled={isLoading}
          icon={editing ? 'pencil' : 'plus'}
          mode='contained'
          onPress={form.handleSubmit(onFormSubmit)}
        >
          {editing ? 'Update' : 'Add'}
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
}
