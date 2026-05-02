import { useColorScheme } from "react-native";

import { BidaDarkColors, BidaLightColors } from "@/constants/bidaTheme";

export function useBidaTheme() {
  const colorScheme = useColorScheme();

  return colorScheme === "dark" ? BidaDarkColors : BidaLightColors;
}
