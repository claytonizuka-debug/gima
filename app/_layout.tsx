import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

import { GimaColors } from '@/constants/gimaTheme';
import { AuthProvider } from '@/context/AuthContext';
import { SavedBusinessesProvider } from '@/context/SavedBusinessesContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedBusinessesProvider>
        <StatusBar barStyle="dark-content" backgroundColor={GimaColors.background} />

        <Stack
          screenOptions={{
            headerBackTitle: '',
            headerTintColor: GimaColors.ocean,
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: GimaColors.background,
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: '',
            }}
          />

          <Stack.Screen
            name="business/[slug]"
            options={{
              headerShown: true,
              title: '',
              headerTitle: '',
              headerBackTitle: '',
              headerBackVisible: true,
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
              title: '',
            }}
          />
        </Stack>
      </SavedBusinessesProvider>
    </AuthProvider>
  );
}