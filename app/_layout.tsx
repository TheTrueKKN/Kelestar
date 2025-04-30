import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  const [fontLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Urbanist-Black": require("../assets/fonts/Urbanist-Black.ttf"),
    "Urbanist-Medium": require("../assets/fonts/Urbanist-Medium.ttf"),
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-Bold": require("../assets/fonts/Urbanist-Bold.ttf"),
    "Urbanist-SemiBold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
  });

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    if (error) throw error;

    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded, error]);

  if (!fontLoaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(customer-tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="budget"
          options={{
            headerShown: true,
            headerTitle: "Carbon Budget",
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            headerShown: true,
            headerTitle: "History",
          }}
        />
        <Stack.Screen
          name="faq"
          options={{
            headerShown: true,
            headerTitle: "FAQs",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            headerTitle: "Settings",
          }}
        />
        <Stack.Screen
          name="badge"
          options={{
            headerShown: true,
            headerTitle: "Badges",
          }}
        />
        <Stack.Screen
          name="nutrition"
          options={{
            headerShown: true,
            headerTitle: "Nutrition",
          }}
        />
        <Stack.Screen
          name="editdish"
          options={{
            headerShown: true,
            headerTitle: "Edit Current Dish",
          }}
        />
        <Stack.Screen
          name="createdish"
          options={{
            headerShown: true,
            headerTitle: "Create New Dish",
          }}
        />
        <Stack.Screen
          name="editvendor"
          options={{
            headerShown: true,
            headerTitle: "Editing Vendor Details",
          }}
        />
        <Stack.Screen
          name="initialmenu"
          options={{
            headerShown: true,
            headerTitle: "Creating Menu",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
