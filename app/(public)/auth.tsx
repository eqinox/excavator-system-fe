import AuthenticationForm from '@/components/AuthenticationForm';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/redux/useReduxHooks';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function AuthScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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
