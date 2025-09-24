import { Redirect } from 'expo-router';
import React from 'react';

export default function TabsIndex() {
  // This tab will redirect to categories
  return <Redirect href='/(private)/categories' />;
}
