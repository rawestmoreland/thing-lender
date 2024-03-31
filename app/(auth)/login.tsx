import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput, Text, HelperText } from 'react-native-paper';
import { appInfo } from '@/constants/appInfo';
import { useState } from 'react';

export default function LogIn() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  const formSchema = z.object({
    email: z.string().email({ message: 'Must be a valid email' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 8 characters' }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: params?.email ?? '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
      <View style={{ alignItems: 'center' }}>
        <Text variant='bodyLarge' style={{ fontWeight: '600' }}>
          Welcome to
        </Text>
        <Text variant='headlineSmall' style={{ fontWeight: '600' }}>
          {appInfo.name}
        </Text>
      </View>
      <View style={{ width: '75%', gap: 8 }}>
        <View style={{ gap: 8 }}>
          <View>
            <Controller
              control={form.control}
              name='email'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  dense
                  autoCapitalize='none'
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
          <View>
            <Controller
              control={form.control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  right={
                    <TextInput.Icon
                      icon={hidePassword ? 'eye' : 'eye-off'}
                      onPress={() => setHidePassword(!hidePassword)}
                    />
                  }
                  dense
                  error={form.formState.errors.password ? true : false}
                  mode='outlined'
                  autoCapitalize='none'
                  placeholder='Password'
                  secureTextEntry={hidePassword}
                  onChangeText={onChange}
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
        </View>
        <View style={{ gap: 8 }}>
          <Button
            loading={isLoading}
            disabled={isLoading}
            mode='contained'
            onPress={form.handleSubmit(onSubmit)}
          >
            Login
          </Button>
          <Button
            disabled={isLoading}
            onPress={() => {
              router.push('/(auth)/create-account');
            }}
          >
            Create Account
          </Button>
        </View>
      </View>
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
