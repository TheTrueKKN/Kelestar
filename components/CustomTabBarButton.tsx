// CustomTabBarButton.tsx
import React from "react";
import { TouchableNativeFeedback, TouchableOpacity, View, Platform, GestureResponderEvent } from "react-native";

interface CustomTabBarButtonProps {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomTabBarButton = ({ children, onPress }: CustomTabBarButtonProps) => {
  // For Android, use TouchableNativeFeedback with smaller ripple
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple("#74B318", false, 0)}
      >
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  } else {
    // For iOS, use TouchableOpacity with minimal feedback
    return (
      <TouchableOpacity 
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }
};

export default CustomTabBarButton;
