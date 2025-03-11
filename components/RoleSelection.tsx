import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { updateUser } from "../controller/userController";
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
    <View className="space-y-2 justify-center display-flex alignItems-center">
      <Text className="text-black text-2xl mt-10"> Are you</Text>

      <TouchableOpacity
        className={`border border-black-300 rounded-lg p-4 mb-4 ${
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

      <Text className="justify-center p-3 text-semibold font-psemibold text-base ">
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
        <Text className="text-white text-lg text-semibold font-psemibold text-center">
          Next step
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelection;
