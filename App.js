import "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { TailwindProvider } from "tailwind-rn";
import utilities from "tailwind/styles.json";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "navigation/StackNavigator";
import * as SplashScreen from "expo-splash-screen";
import { useLoadFonts } from "fonts/useLoadFonts";
import { AuthProvider } from "services/auth/AuthContext";
import { UserProvider } from "services/auth/UserContext";
import { AchievementProvider } from "services/auth/AchievementContext";
import { QueryClient, QueryClientProvider } from "react-query";

SplashScreen.preventAutoHideAsync();

const linking = {
  prefixes: ["http://localhost:19006", "localhost:19006://"],
  config: {
    screens: {
      Admin: "admin",
    },
  },
};

export default function App() {
  const { fontsLoaded, onLayoutRootView } = useLoadFonts();
  const queryClient = new QueryClient();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AchievementProvider>
      <UserProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <View style={styles.container} onLayout={onLayoutRootView}>
              <NavigationContainer linking={linking}>
                <TailwindProvider utilities={utilities}>
                  <StackNavigator />
                </TailwindProvider>
              </NavigationContainer>
            </View>
          </QueryClientProvider>
        </AuthProvider>
      </UserProvider>
    </AchievementProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
