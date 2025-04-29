import { View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";
import CustomTabBarButton from "../../components/CustomTabBarButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface TabIconProps {
  icon: any;
  color: string;
  focused: boolean;
}

const TabIcon = ({ icon, color, focused }: TabIconProps) => {
  return (
    <View className="items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6 mb-1"
      />
      {focused && (
        <View className="h-1.5 w-1.5 rounded-full bg-green mt-1" />
      )}
    </View>
  );
};

const CustomerTabsLayout = () => {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#74B318",
          tabBarInactiveTintColor: "#999999",
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            height: 100,
            backgroundColor: "#F1F1F1",
            borderColor: "#E0E0E0",
            borderTopWidth: 1,
            shadowOpacity: 0.25,
            shadowRadius: 25,
            borderRadius: 20,
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.cust_home} color={color} focused={focused} />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} onPress={(e) => props.onPress?.(e)} />
            ),
          }}
        />

        <Tabs.Screen
          name="choose"
          options={{
            title: "Choose Meal",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.meal} color={color} focused={focused} />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} onPress={(e) => props.onPress?.(e)} />
            ),
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: "Statistics",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.stats} color={color} focused={focused} />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} onPress={(e) => props.onPress?.(e)} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.cust_profile} color={color} focused={focused} />
            ),
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} onPress={(e) => props.onPress?.(e)} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
};

export default CustomerTabsLayout;
