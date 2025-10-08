import AuthenticationForm from '@/components/forms/AuthenticationForm';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { AppState } from '@/store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function AuthScreen() {
  const router = useRouter();
  const isAuthenticated = useSelector((state: AppState) => {
    return state.auth.isAuthenticated;
  });

  useEffect(() => {
    if (isAuthenticated) {
      // If user is already authenticated, redirect to categories
      // No matter if its with (private) or wihtout.
      router.replace('/(private)/categories');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <Center className='flex-1'>
        <Text>Пренасочване...</Text>
      </Center>
    );
  }

  return <AuthenticationForm />;
}
