import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";

const fontAssets = {
  "Pally": require("./Pally-Regular.ttf"),
  "MarckScript": require("./MarckScript-Regular.ttf"),
  "SpringSnowstorm": require("./Spring-Snowstorm.ttf"),
  "HandleeRegular": require("./Handlee-Regular.ttf"),
  "PatrickHandRegular": require("./PatrickHand-Regular.ttf"),

};
// TODO problèmes de chargement de font
export const useLoadFonts = () => {
  const [fontsLoaded] = useFonts(fontAssets);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return { fontsLoaded, onLayoutRootView };
};
