import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/redux/useReduxHooks';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function IndexScreen() {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If user is authenticated, redirect to private area
        router.replace('/(private)/categories');
      } else {
        // If not authenticated, redirect to auth screen
        router.replace('/(public)/auth');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Center className='flex-1'>
        <Text>Зареждане...</Text>
      </Center>
    );
  }

  return (
    <Center className='flex-1'>
      <Text>Пренасочване...</Text>
    </Center>
  );
}
