import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

import { AuthProvider } from '@/context/AuthContext';
import { SavedBusinessesProvider } from '@/context/SavedBusinessesContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedBusinessesProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f7f4" />

        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="business/[slug]"
            options={{
              headerShown: true,
              headerBackVisible: true,
              title: 'Business',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SavedBusinessesProvider>
    </AuthProvider>
  );
}