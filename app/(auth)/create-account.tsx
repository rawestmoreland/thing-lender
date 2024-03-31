import { View, StyleSheet, Alert } from 'react-native';
import { useRef, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import { z } from 'zod';
import {
  Text,
  Button,
  TextInput,
  HelperText,
  Portal,
  Snackbar,
  Dialog,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CreateAccount() {
  const router = useRouter();
  const { createAccount } = useAuth();

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);

  const onDismissSnackbar = () => setSnackbarMessage('');
  const onDismissDialog = () => setAccountCreated(false);

  const formSchema = z
    .object({
      email: z.string().email({ message: 'Must be a valid email' }),
      password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' }),
      passwordConfirm: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' }),
      name: z
        .string()
        .min(2, { message: 'First name must be at least 2 characters' })
        .or(z.literal('')),
    })
    .superRefine(({ password, passwordConfirm }, ctx) => {
      if (password !== passwordConfirm) {
        ctx.addIssue({
          message: 'Passwords do not match',
          code: 'custom',
          path: ['passwordConfirm'],
        });
      }
      return {};
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password, passwordConfirm, name } = data;
    const response = await createAccount({
      email,
      password,
      name,
      passwordConfirm,
    });

    if (response?.error) {
      if (response.error.data.email) {
        setSnackbarMessage(response.error.data.email.message);
      }
      return;
    }

    setAccountCreated(true);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <Text variant='bodyLarge' style={{ fontWeight: '600' }}>
        Create an account
      </Text>
      <View style={{ width: '75%', gap: 12 }}>
        <View style={{ gap: 8 }}>
          <View style={{ gap: 4 }}>
            <Controller
              control={form.control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  dense
                  autoCapitalize='none'
                  keyboardType='email-address'
                  error={form.formState.errors.email ? true : false}
                  mode='outlined'
                  placeholder='Email'
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {form.formState.errors.email && (
              <HelperText
                type='error'
                visible={Boolean(form.formState.errors.email)}
              >
                {form.formState.errors.email?.message}
              </HelperText>
            )}
          </View>
          <View style={{ gap: 4 }}>
            <Controller
              control={form.control}
              name='name'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  dense
                  error={form.formState.errors.name ? true : false}
                  mode='outlined'
                  placeholder='Name (optional)'
                  onChangeText={onChange}
                  value={value}
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
          <View>
            <Controller
              control={form.control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  dense
                  error={form.formState.errors.password ? true : false}
                  mode='outlined'
                  placeholder='Password'
                  onChangeText={onChange}
                  secureTextEntry
                  value={value}
                />
              )}
            />
            {form.formState.errors.password && (
              <HelperText
                type='error'
                visible={Boolean(form.formState.errors.password)}
              >
                {form.formState.errors.password?.message}
              </HelperText>
            )}
          </View>
          <View>
            <Controller
              control={form.control}
              name='passwordConfirm'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  dense
                  error={form.formState.errors.passwordConfirm ? true : false}
                  mode='outlined'
                  placeholder='Confirm Password'
                  onChangeText={onChange}
                  secureTextEntry
                  value={value}
                />
              )}
            />
            {form.formState.errors.passwordConfirm && (
              <HelperText
                type='error'
                visible={Boolean(form.formState.errors.passwordConfirm)}
              >
                {form.formState.errors.passwordConfirm?.message}
              </HelperText>
            )}
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <Button mode='contained' onPress={form.handleSubmit(onSubmit)}>
            Create account
          </Button>
          <Button onPress={() => router.back()}>Back to login</Button>
        </View>
      </View>
      <Portal>
        <Dialog visible={accountCreated} onDismiss={onDismissDialog}>
          <Dialog.Title>Account created!</Dialog.Title>
          <Dialog.Content>
            <Text>
              Your account has been created. Please login to continue.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                onDismissDialog();
                router.replace({
                  pathname: '/login',
                  params: { email: form.getValues().email },
                });
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Snackbar
          visible={Boolean(snackbarMessage)}
          onDismiss={onDismissSnackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: '#455fff',
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#455fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
});
