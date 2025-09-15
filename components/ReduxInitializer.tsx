import { useAppDispatch } from '@/redux/hooks';
import { initializeAuth } from '@/redux/userSlice';
import { useEffect } from 'react';

interface ReduxInitializerProps {
  children: React.ReactNode;
}

export default function ReduxInitializer({ children }: ReduxInitializerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state when the app starts
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}
