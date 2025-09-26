import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/redux/useReduxHooks';
import { Redirect, Slot } from 'expo-router';
import React, { useEffect } from 'react';

export default function PrivateLayout() {
  const { loading: isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // This effect will trigger re-renders when auth state changes
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <Center className='flex-1'>
        <Text>Зареждане...</Text>
      </Center>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to auth screen
    return <Redirect href='/(public)/auth' />;
  }

  // If authenticated, show the private content
  return <Slot />;
}
