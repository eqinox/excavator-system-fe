import AuthenticationForm from '@/components/AuthenticationForm';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/redux/useReduxHooks';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function AuthScreen() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to categories
    if (!isLoading && user) {
      router.replace('/categories');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Center className='flex-1'>
        <Text>Зареждане...</Text>
      </Center>
    );
  }

  // If user is authenticated, show loading (will redirect)
  if (user) {
    return (
      <Center className='flex-1'>
        <Text>Пренасочване...</Text>
      </Center>
    );
  }

  // Show auth form for unauthenticated users
  return <AuthenticationForm />;
}
