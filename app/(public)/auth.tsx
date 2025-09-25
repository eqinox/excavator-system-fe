import AuthenticationForm from '@/components/AuthenticationForm';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/redux/useReduxHooks';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function AuthScreen() {
  const {
    user,
    // loading: isLoading
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      // !isLoading &&
      user
    ) {
      // If user is already authenticated, redirect to categories
      router.replace('/(private)/categories');
    }
  }, [
    user,
    // isLoading,
    router,
  ]);

  // if (isLoading) {
  //   return (
  //     <Center className='flex-1'>
  //       <Text>Зареждане...</Text>
  //     </Center>
  //   );
  // }

  if (user) {
    return (
      <Center className='flex-1'>
        <Text>Пренасочване...</Text>
      </Center>
    );
  }

  return <AuthenticationForm />;
}
