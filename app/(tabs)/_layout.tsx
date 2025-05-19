import { Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, Text } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

type TabIconProps = {
  icon: any;
  label: string;
  color: string;
  focused: boolean;
};

const NoFeedbackTabBarButton = (props: any) => (
  <Pressable {...props} android_ripple={null} style={props.style}>
    {props.children}
  </Pressable>
);

const TabIcon: React.FC<TabIconProps> = ({ icon, label, color, focused }) => (
  <View
    className="items-center justify-center"
    style={{ flex: 1, marginTop: 8 }}
  >
    {/* background circle when focused */}
    <View
      className={`rounded-2xl`}
      style={{
        padding: 8,
        marginBottom: 2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "transparent",
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        minWidth: 38,
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 26, height: 26 }}
      />
    </View>
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      className={`text-[12px] mt-1 ${
        focused ? "text-primary font-psemibold" : "text-gray-500 font-pregular"
      }`}
      style={{
        letterSpacing: 0.2,
        maxWidth: 100,
        minWidth: 60,
        textAlign: "center",
        overflow: "visible",
      }}
    >
      {label}
    </Text>
  </View>
);

const HomeTabBarIcon = (props: { color: string; focused: boolean }) => (
  <TabIcon
    icon={icons.home}
    label="Home"
    color={props.color}
    focused={props.focused}
  />
);

const MenuTabBarIcon = (props: { color: string; focused: boolean }) => (
  <TabIcon
    icon={icons.dishMenu}
    label="Menu"
    color={props.color}
    focused={props.focused}
  />
);

const ProfileTabBarIcon = (props: { color: string; focused: boolean }) => (
  <TabIcon
    icon={icons.profile}
    label="Profile"
    color={props.color}
    focused={props.focused}
  />
);

export default function TabsLayout() {
  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-white">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#74B318",
          tabBarInactiveTintColor: "#999999",
          tabBarButton: NoFeedbackTabBarButton,
          tabBarStyle: {
            height: 74,
            paddingTop: 10,
            paddingBottom: 14,
            backgroundColor: "#F6F6F6",
            borderTopWidth: 0,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: -4 },
            shadowRadius: 10,
          },
          tabBarItemStyle: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            minWidth: 80,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            tabBarIcon: HomeTabBarIcon,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            tabBarIcon: MenuTabBarIcon,
          }}
        />
        <Tabs.Screen
          name="vendorprofile"
          options={{
            tabBarIcon: ProfileTabBarIcon,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
