import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const settings = () => {
  const handleOptionPress = (option: string) => {
    console.log(`${option} pressed`);
  };

  const handleProfilePress = () => {
    console.log('Profile photo pressed - should open image picker');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Profile Section */}
      <View className="items-center justify-center px-[19px] py-[20px] relative">
        <TouchableOpacity onPress={handleProfilePress}>
          <View className="relative">
            <Image
              source={require("../assets/icons/avatar_icon.png")}
              className="w-[80px] h-[80px] rounded-full"
            />
            <View className="absolute bottom-0 right-0">
              <Image
                source={require("../assets/icons/edit_icon.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Settings Options */}
      <View className="mt-4">
        {[
          { label: "Username", value: "liangliu1999" },
          { label: "Email", value: "liu0091@student.monash.edu" },
          { label: "Password", value: "" },
          { label: "Feedback", value: "" },
          { label: "Terms and conditions", value: "" },
          { label: "About", value: "" },
          { label: "Log out", value: "" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleOptionPress(item.label)}
            className="flex-row justify-between items-center px-[19px] py-[15px]"
          >
            <Text className="font-pregular text-[16px] text-[#1E1F1F]">
              {item.label}
            </Text>
            <View className="flex-row items-center">
              <Text className="font-pregular text-[16px] text-gray-500 mr-2">
                {item.value}
              </Text>
              <Image 
                source={require("../assets/icons/arrow_right_icon.png")}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default settings;
