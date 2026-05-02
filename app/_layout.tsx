import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BidaColors } from "@/constants/bidaTheme";
import { AuthProvider } from "@/context/AuthContext";
import { SavedBusinessesProvider } from "@/context/SavedBusinessesContext";

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
              headerShown: false,
            }}
          />
        </SavedBusinessesProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
