// import { useAuth } from '@/redux/useReduxHooks';
import { AppState } from '@/store';
import { Redirect, Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function PrivateLayout() {
  // const { loading: isLoading, isAuthenticated } = useAuth();
  const isAuthenticated = useSelector((state: AppState) => {
    return state.auth.isAuthenticated;
  });

  useEffect(() => {
    // This effect will trigger re-renders when auth state changes
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // If not authenticated, redirect to auth screen
    return <Redirect href='/(public)/auth' />;
  }

  // If authenticated, show the private content
  return <Slot />;
}
