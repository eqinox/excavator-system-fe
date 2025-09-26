import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/redux/useReduxHooks';
import {
  loginSchema,
  signupSchema,
  type LoginFormData,
  type SignupFormData,
} from '@/validation/authentication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function AuthenticationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const { login, register, error: authError } = useAuth();
  const [isLogin, setIsLogin] = useState(params.mode !== 'signup');
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    },
  });

  // Update form when mode changes
  useEffect(() => {
    const newMode = params.mode === 'signup' ? false : true;
    setIsLogin(newMode);
    reset(); // Reset form when switching modes with default values
  }, [params.mode, reset]);

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login({
          email: data.email,
          password: data.password,
        });
      } else {
        await register({
          email: data.email,
          password: data.password,
          username: (data as SignupFormData).username || undefined,
        });
        setError(null);
        // After successful registration, you might want to auto-login
        // or show a success message
      }
    } catch (error: any) {
      // setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return (errors as any)[fieldName]?.message;
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };
  console.log('authError', authError);
  return (
    <Box className='min-h-screen flex-1 bg-background-100'>
      <Box className='py-safe flex-1 items-center justify-center px-4'>
        <Card className='w-full max-w-md bg-background-0 p-6 shadow-lg'>
          <VStack space='md' className='w-full'>
            {/* Header */}
            <Box className='mb-6 items-center'>
              <Text className='mb-2 text-2xl font-bold text-typography-900'>
                {isLogin ? 'Добре дошли отново' : 'Създаване на акаунт'}
              </Text>
              <Text className='text-center text-typography-500'>
                {isLogin
                  ? 'Влезте в акаунта си, за да продължите'
                  : 'Попълнете данните по-долу, за да създадете акаунт'}
              </Text>
            </Box>

            <VStack space='md' className='w-full'>
              {/* Global error message */}
              {error && (
                <Box className='rounded-md border border-error-200 bg-error-50 p-3'>
                  <Text className='text-sm text-error-600'>{error}</Text>
                </Box>
              )}

              {authError && (
                <Box className='rounded-md border border-error-200 bg-error-50 p-3'>
                  <Text className='text-sm text-error-600'>{authError}</Text>
                </Box>
              )}

              {/* Email Field */}
              <FormControl isInvalid={!!getFieldError('email')}>
                <FormControlLabel>
                  <FormControlLabelText>Имейл</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name='email'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder='Въведете вашия имейл'
                        value={value ?? ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        onSubmitEditing={() => handleSubmit(onSubmit)()}
                      />
                    </Input>
                  )}
                />
                {errors.email && (
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.email.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Username Field */}
              {!isLogin && (
                <FormControl isInvalid={!!getFieldError('username')}>
                  <FormControlLabel>
                    <FormControlLabelText>
                      Потребителско име (Незадължително)
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name='username'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder='Въведете потребителско име'
                          value={value ?? ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize='none'
                          onSubmitEditing={() => handleSubmit(onSubmit)()}
                        />
                      </Input>
                    )}
                  />
                  {getFieldError('username') && (
                    <FormControlError>
                      <FormControlErrorText>
                        {getFieldError('username')}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              )}

              {/* Password Field */}
              <FormControl isInvalid={!!getFieldError('password')}>
                <FormControlLabel>
                  <FormControlLabelText>Парола</FormControlLabelText>
                </FormControlLabel>
                <Controller
                  control={control}
                  name='password'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder='Въведете вашата парола'
                        value={value ?? ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                        onSubmitEditing={() => handleSubmit(onSubmit)()}
                      />
                    </Input>
                  )}
                />
                {errors.password && (
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.password.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Confirm Password Field */}
              {!isLogin && (
                <FormControl isInvalid={!!getFieldError('confirmPassword')}>
                  <FormControlLabel>
                    <FormControlLabelText>Потвърди парола</FormControlLabelText>
                  </FormControlLabel>
                  <Controller
                    control={control}
                    name='confirmPassword'
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder='Потвърдете вашата парола'
                          value={value ?? ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          secureTextEntry
                          onSubmitEditing={() => handleSubmit(onSubmit)()}
                        />
                      </Input>
                    )}
                  />
                  {getFieldError('confirmPassword') && (
                    <FormControlError>
                      <FormControlErrorText>
                        {getFieldError('confirmPassword')}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              )}

              {/* Submit Button */}
              <Button
                size='lg'
                className='mt-4 bg-primary-500'
                onPress={handleSubmit(onSubmit)}
                isDisabled={isSubmitting}
              >
                <ButtonText>
                  {isSubmitting
                    ? 'Обработване...'
                    : isLogin
                      ? 'Влизане'
                      : 'Регистрация'}
                </ButtonText>
              </Button>
            </VStack>

            {/* Toggle Form Type */}
            <HStack className='items-center justify-center'>
              <Text className='text-typography-500'>
                {isLogin ? 'Нямате акаунт? ' : 'Вече имате акаунт? '}
              </Text>
              <Button
                variant='link'
                size='sm'
                className='p-0'
                onPress={toggleForm}
              >
                <ButtonText className='text-primary-500'>
                  {isLogin ? 'Регистрация' : 'Влизане'}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Box>
    </Box>
  );
}
