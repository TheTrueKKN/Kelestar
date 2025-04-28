import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { updateUser } from "../controllers/userController";
import { UserRole } from "../enums/userRole";

const RoleSelection = () => {
  const [selectedOption, setSelectedOption] = useState<UserRole | null>(null);
  const router = useRouter();

  const handlePress = async () => {
    await updateUser({user_role: selectedOption});
    if (selectedOption === UserRole.Customer) {
      router.push("/faq");
    } else if (selectedOption === UserRole.Vendor) {
      router.push("/vendordetail");
    }
  };

  return (
    <View className="space-y-2 display-flex items-center flex-1">
      <TouchableOpacity
        className={`border border-black-300 rounded-lg p-4 mb-1 w-full  ${
          selectedOption === UserRole.Customer
            ? "border-green-500 bg-green-100"
            : ""
        }`}
        onPress={() => setSelectedOption(UserRole.Customer)}
      >
        <Text className="text-lg">Customer</Text>
        <Text className="text-gray-600">
          Track your daily food carbon footprint
        </Text>
      </TouchableOpacity>

      <Text className="p-3 text-semibold font-psemibold text-base ">
        {" "}
        or{" "}
      </Text>

      <TouchableOpacity
        className={`border border-black-300 rounded-lg p-4 mb-4 ${
          selectedOption === UserRole.Vendor
            ? "border-green-500 bg-green-100"
            : ""
        }`}
        onPress={() => setSelectedOption(UserRole.Vendor)}
      >
        <Text className="text-lg">Vendor</Text>
        <Text className="text-gray-600">
          Disclose your food carbon footprint to customers with a digital menu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`rounded-lg p-4 mt-6 ${
          selectedOption ? "bg-green/100" : "bg-gray-300"
        }`}
        disabled={!selectedOption}
        onPress={handlePress}
      >
        <Text className="text-white text-lg text-semibold font-psemibold text-center w-full">
          Next step
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelection;
