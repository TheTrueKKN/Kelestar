import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { updateUser } from "../controllers/userController";
import { UserRole } from "../enums/userRole";
import { icons } from "../constants";

const RoleSelection = () => {
  const [selectedOption, setSelectedOption] = useState<UserRole | null>(null);
  const router = useRouter();
  
  const activeColor = "#74B318";
  const inactiveColor = "#999999";

  const handlePress = async () => {
    await updateUser({ user_role: selectedOption });
    if (selectedOption === UserRole.Customer) {
      router.replace("/(customer-tabs)/home");
    } else if (selectedOption === UserRole.Vendor) {
      router.push("/vendordetail");
    }
  };

  return (
    <View className="space-y-2.5 justify-center flex items-center w-full px-5">
      <Text className="text-black text-2xl mt-10 self-start">Are you</Text>

      <TouchableOpacity
        activeOpacity={0.6}
        className={`border rounded-lg p-4 w-full h-[132px] ${
          selectedOption === UserRole.Customer
            ? "border-2 border-green/100"
            : "border border-black-300"
        }`}
        onPress={() => setSelectedOption(UserRole.Customer)}
      >
        <View className="flex-row items-center space-x-2">
          <Image
            source={icons.cust_home}
            style={{ 
              width: 24, 
              height: 24, 
              tintColor: selectedOption === UserRole.Customer ? activeColor : inactiveColor 
            }}
            resizeMode="contain"
          />
          <Text className="text-lg">Customer</Text>
        </View>
        <Text className="text-gray-600">
          Track your daily food carbon footprint
        </Text>
      </TouchableOpacity>

      <Text className="justify-center text-semibold font-psemibold text-base">
        or
      </Text>

      <TouchableOpacity
        activeOpacity={0.6}
        className={`border rounded-lg p-4 mb-4 w-full h-[132px] ${
          selectedOption === UserRole.Vendor
            ? "border-2 border-green/100"
            : "border border-black-300"
        }`}
        onPress={() => setSelectedOption(UserRole.Vendor)}
      >
        <View className="flex-row items-center space-x-2">
          <Image
            source={icons.dishMenu}
            style={{ 
              width: 24, 
              height: 24, 
              tintColor: selectedOption === UserRole.Vendor ? activeColor : inactiveColor 
            }}
            resizeMode="contain"
          />
          <Text className="text-lg">Vendor</Text>
        </View>
        <Text className="text-gray-600">
          Disclose your food carbon footprint to customers with a digital menu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`rounded-lg p-4 mt-6 w-full ${
          selectedOption ? "bg-green/100" : "bg-gray-300"
        }`}
        disabled={!selectedOption}
        onPress={handlePress}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Next step
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelection;
