import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/store/authContext';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#0a7ea4',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          display: 'none', // Hide the tab bar completely
        },
      }}
    >
      <Tabs.Screen name='index' />
    </Tabs>
  );
}
