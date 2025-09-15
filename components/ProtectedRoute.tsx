import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/redux/useReduxHooks';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to auth form if not authenticated
      router.replace('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Center className='flex-1'>
        <Text>Зареждане...</Text>
      </Center>
    );
  }

  if (!user) {
    return (
      <Center className='flex-1'>
        <Text>Пренасочване към вход...</Text>
      </Center>
    );
  }

  return <>{children}</>;
}
