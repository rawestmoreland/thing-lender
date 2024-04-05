import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Stack } from 'expo-router';
import Colors from '@/design/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AppLayout() {
  return (
    <Stack initialRouteName='home'>
      <Stack.Screen
        name='home'
        options={{
          title: 'On Loan',
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name='settings'
        options={{
          title: 'Settings',
          headerTransparent: true,
          headerLeft: () => {
            return (
              <Link href='/home'>
                <TabBarIcon name='home' color='black' />
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name='inventory'
        options={{
          title: 'My Things',
          headerTransparent: true,
          headerLeft: () => {
            return (
              <Link href='/home'>
                <TabBarIcon name='home' color='black' />
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href='/new-thing'>
                <TabBarIcon name='plus' color='black' />
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name='borrowers'
        options={{
          title: 'My Borrowers',
          headerTransparent: true,
          headerLeft: () => {
            return (
              <Link href='/home'>
                <TabBarIcon name='home' color='black' />
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href='/new-borrower'>
                <TabBarIcon name='user-plus' color='black' />
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name='borrower/[id]'
        options={{
          title: 'Edit borrower',
          headerTransparent: true,
          headerLeft: () => {
            return (
              <Link href='/borrowers'>
                <TabBarIcon name='arrow-left' color='black' />
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name='thing/[id]'
        options={{
          title: 'Edit thing',
          headerTransparent: true,
          headerLeft: () => {
            return (
              <Link href='/inventory'>
                <TabBarIcon name='arrow-left' color='black' />
              </Link>
            );
          },
        }}
      />
      <Stack.Screen
        name='new-borrower'
        options={{
          title: 'New Borrower',
          headerTransparent: true,
          headerLeft: () => (
            <Link href='/borrowers'>
              <TabBarIcon name='arrow-left' color='black' />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name='new-thing'
        options={{
          title: 'Add a thing',
          headerTransparent: true,
          headerLeft: () => {
            return (
              <Link href='/inventory'>
                <TabBarIcon name='arrow-left' color='black' />
              </Link>
            );
          },
        }}
      />
    </Stack>
  );
}
