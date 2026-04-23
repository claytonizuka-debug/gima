import { AuthProvider } from '@/context/AuthContext';
import { SavedBusinessesProvider } from '@/context/SavedBusinessesContext';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <SavedBusinessesProvider>
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