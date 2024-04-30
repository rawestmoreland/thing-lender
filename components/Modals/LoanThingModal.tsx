import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { RecordModel } from 'pocketbase';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { Button, HelperText, Portal, TextInput } from 'react-native-paper';
import { CountryPicker } from 'react-native-country-codes-picker';
import { z } from 'zod';
import DatePicker from '../DateTimePicker';
import { useCreateBorrower } from '@/hooks/CREATE/useCreateBorrower';
import { useCreateLentThing } from '@/hooks/CREATE/useCreateLentThing';
import { useRouter } from 'expo-router';
import { CountryCode } from 'libphonenumber-js';

export type TCountryCode = {
  code: CountryCode;
  dial_code: string;
  flag: string;
};

export function LoanThingModal({
  isOpen,
  onDismiss,
  thingId,
  borrowers,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  thingId: string;
  borrowers: RecordModel[];
}) {
  const [selectedBorrower, setSelectedBorrower] = useState(borrowers?.[0]?.id);
  const [showNewBorrowerForm, setShowNewBorrowerForm] = useState(
    Boolean(!borrowers.length)
  );

  const [CCPickerOpen, setCCPickerOpen] = useState(false);
  const [countryCode, setCountryCode] = useState<TCountryCode>({
    code: 'US',
    dial_code: '+1',
    flag: '🇺🇸',
  });

  const toggleNewBorrowerForm = () => setShowNewBorrowerForm((prev) => !prev);

  const initialDate = new Date();
  const [dueDate, setDueDate] = useState(initialDate);

  const router = useRouter();

  const {
    mutate: createBorrower,
    data: newBorrower,
    isPending: creatingBorrower,
  } = useCreateBorrower();
  const {
    mutate: createLentThing,
    data: newLentThing,
    isPending: creatingLoan,
    error: createLentThingError,
  } = useCreateLentThing();

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
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, email, phone } = data;

    // create the the new borrower
    createBorrower({ name, email, phone_number: phone.toString() });
  };

  const onCreateLentThing = async () => {
    createLentThing({
      thing_id: thingId,
      borrower_id: selectedBorrower,
      due_date: dueDate.toISOString(),
    });
  };

  // Loan the thing when we have a new borrower
  useEffect(() => {
    createLentThing({
      thing_id: thingId,
      borrower_id: newBorrower?.id,
      due_date: dueDate.toISOString(),
    });
  }, [newBorrower]);

  // Close the modal when we have a new lent thing and go back home
  useEffect(() => {
    if (newLentThing) {
      onDismiss();
      router.navigate('/home');
    }
  }, [newLentThing]);

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onDismiss}
      avoidKeyboard
      backdropOpacity={0.7}
    >
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          gap: 8,
        }}
      >
        {Boolean(borrowers.length) && !showNewBorrowerForm ? (
          <Picker
            selectedValue={selectedBorrower}
            onValueChange={(itemValue, _itemIndex) =>
              setSelectedBorrower(itemValue)
            }
          >
            {borrowers.map((borrower) => (
              <Picker.Item
                key={borrower.id}
                label={borrower.name}
                value={borrower.id}
              />
            ))}
          </Picker>
        ) : (
          <NewBorrowerForm
            CCPickerOpen={CCPickerOpen}
            setCCPickerOpen={setCCPickerOpen}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            form={form}
          />
        )}
        {Boolean(borrowers.length) && (
          <Button
            onPress={toggleNewBorrowerForm}
            icon={showNewBorrowerForm ? 'arrow-left' : 'plus'}
            mode='outlined'
          >
            {showNewBorrowerForm ? `Pick a borrower` : `New borrower`}
          </Button>
        )}
        <DatePicker
          initialDate={new Date()}
          date={dueDate}
          setDate={setDueDate}
        />
        <Button
          onPress={
            showNewBorrowerForm
              ? form.handleSubmit(onSubmit)
              : onCreateLentThing
          }
          disabled={!dueDate || creatingBorrower || creatingLoan}
          loading={creatingLoan || creatingBorrower}
          mode='contained'
          icon='handshake-outline'
        >
          Lend it
        </Button>
      </View>
    </Modal>
  );
}

export const NewBorrowerForm = ({
  form,
  CCPickerOpen,
  setCCPickerOpen,
  setCountryCode,
  countryCode,
}: {
  form: any;
  CCPickerOpen: boolean;
  setCCPickerOpen: any;
  setCountryCode: (value: TCountryCode) => void;
  countryCode: TCountryCode;
}) => {
  return (
    <View style={{ gap: 8 }}>
      <View style={{ gap: 4 }}>
        <Controller
          control={form.control}
          name='name'
          render={({ field }) => (
            <TextInput
              label='Name'
              mode='outlined'
              dense
              value={field.value}
              onChangeText={field.onChange}
              error={form.formState.errors.name}
              placeholder='Borrower name'
            />
          )}
        />
        {form.formState.errors.name && (
          <HelperText
            type='error'
            visible={Boolean(form.formState.errors.name)}
          >
            {form.formState.errors.name.message}
          </HelperText>
        )}
      </View>
      <View style={{ gap: 4 }}>
        <Controller
          control={form.control}
          name='email'
          render={({ field }) => (
            <TextInput
              label='Email address'
              mode='outlined'
              dense
              autoCapitalize='none'
              keyboardType='email-address'
              value={field.value}
              onChangeText={field.onChange}
              error={form.formState.errors.email}
              placeholder='Borrower email'
            />
          )}
        />
        {form.formState.errors.email && (
          <HelperText
            type='error'
            visible={Boolean(form.formState.errors.email)}
          >
            {form.formState.errors.email.message}
          </HelperText>
        )}
      </View>
      <View style={{ gap: 4, width: '100%' }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
          }}
        >
          <Controller
            control={form.control}
            name='phone'
            render={({ field }) => (
              <TextInput
                left={
                  <TextInput.Affix
                    text={`${countryCode.flag} ${countryCode.dial_code}`}
                    onPress={() => setCCPickerOpen(true)}
                  />
                }
                style={{ flexGrow: 3 }}
                label='Phone'
                mode='outlined'
                dense
                keyboardType='phone-pad'
                value={field.value}
                onChangeText={field.onChange}
                error={form.formState.errors.phone}
                placeholder='Borrower phone'
              />
            )}
          />
        </View>
        <CountryPicker
          lang='en'
          onBackdropPress={() => setCCPickerOpen(false)}
          show={CCPickerOpen}
          showOnly={['US']}
          pickerButtonOnPress={(item) => {
            setCountryCode({
              code: item.code as CountryCode,
              dial_code: item.dial_code,
              flag: item.flag,
            });
            setCCPickerOpen(false);
          }}
          style={{
            modal: {
              height: 300,
            },
          }}
        />
        {form.formState.errors.phone && (
          <HelperText
            type='error'
            visible={Boolean(form.formState.errors.phone)}
          >
            {form.formState.errors.phone.message}
          </HelperText>
        )}
      </View>
    </View>
  );
};
