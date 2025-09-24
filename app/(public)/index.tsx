import { Redirect } from 'expo-router';
import React from 'react';

export default function PublicIndex() {
  // This will redirect to the auth screen
  return <Redirect href='/(public)/auth' />;
}
