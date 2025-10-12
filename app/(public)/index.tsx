import { RootState } from '@/store';
import { Redirect } from 'expo-router';
import React from 'react';
import { useSelector } from 'react-redux';

export default function PublicIndex() {
  const isAuthenticated = useSelector((state: RootState) => {
    return state.auth.isAuthenticated;
  });

  if (isAuthenticated) {
    return <Redirect href='/(private)/categories' />;
  }

  // If not authenticated, redirect to auth screen
  return <Redirect href='/(public)/auth' />;
}
