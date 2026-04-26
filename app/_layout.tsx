import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BidaColors } from "@/constants/bidaTheme";
import { AuthProvider } from "@/context/AuthContext";
import { SavedBusinessesProvider } from "@/context/SavedBusinessesContext";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SavedBusinessesProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={BidaColors.background}
          />

          <Stack
            screenOptions={{
              headerBackTitle: "",
              headerTintColor: BidaColors.ocean,
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: BidaColors.background,
              },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                title: "",
              }}
            />

            <Stack.Screen
              name="business/[slug]"
              options={{
                headerShown: true,
                title: "",
                headerTitle: "",
                headerBackTitle: "",
                headerBackVisible: true,
                animation: "slide_from_right",
              }}
            />

            <Stack.Screen
              name="auth"
              options={{
                headerShown: false,
                title: "",
              }}
            />
          </Stack>
        </SavedBusinessesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
