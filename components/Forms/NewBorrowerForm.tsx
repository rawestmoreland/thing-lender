import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewBorrowerForm as BorrowerForm } from '../Modals/LoanThingModal';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { TBorrower } from '@/lib/types/pocketbase';
import { useEffect } from 'react';
import { RecordModel } from 'pocketbase';

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
  const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Must be a valid email'),
    phone: z
      .string()
      .min(2, 'Phone number must be at least 2 characters long')
      .or(z.literal('')),
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

  return (
    <View style={{ width: '80%', gap: 8 }}>
      <BorrowerForm form={form} />
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
  );
}
