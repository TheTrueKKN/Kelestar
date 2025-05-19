import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { UserRole } from "../../enums/userRole";
import { getUser } from "../../controllers/userController";

export default function CustomerHome() {
  useEffect(() => {
    const initCustomer = async () => {
      const fetchedUser = await getUser();
      if (fetchedUser) {
        
      }
    };
    // console.log(fetchedUser, fetchedUser?.user_role);
    initCustomer();
  }, []);

  return (
    <View className="flex-1 justify-center items-center">
      {/* Good Morning text */}
      <Text className="absolute left-[19px] top-[20px] w-[202px] h-[42px] font-psemibold text-[28px] leading-[42px] text-[#1E1F1F]">
        Good Morning
      </Text>

      {/* Customer home picture - 15px below text, expanded width */}
      <View className="absolute top-[77px] w-full px-[19px]">
        <Image
          source={require("../../assets/images/customer_home_pic.png")}
          className="w-full h-[210px] rounded-2xl"
          resizeMode="cover"
        />
      </View>

      {/* Recommended dishes text - 20px below image */}
      <View className="absolute top-[307px] left-[19px] flex-row h-[36px]">
        <Text className="font-psemibold text-[24px] leading-[36px] text-[#1E1F1F]">
          Recommended{" "}
        </Text>
        <Text className="font-psemibold text-[24px] leading-[36px] text-green">
          dishes
        </Text>
      </View>

      {/* Recommended dish card - Tofu Bowl */}
      <View className="absolute top-[353px] left-[19px] w-[350px] h-[128px] bg-[#F2F2F2] rounded-md flex-row">
        {/* Dish image */}
        <Image
          source={require("../../assets/images/tofu_bowl_pic.png")}
          className="w-[128px] h-[128px] rounded-l-md"
          resizeMode="cover"
        />

        {/* Dish details */}
        <View className="flex-1 p-4 justify-center">
          {/* Dish name */}
          <Text className="font-psemibold text-[18px] text-[#1E1F1F]">
            Tofu Bowl
          </Text>

          {/* Store name */}
          <Text className="font-pregular text-[14px] text-gray-500 mt-1">
            Healthy Eats
          </Text>

          {/* Price */}
          <Text className="font-pbold text-[16px] text-green mt-2">
            RM 12.90
          </Text>
        </View>
      </View>

      {/* Recommended dish card - Mixed Rice */}
      <View className="absolute top-[496px] left-[19px] w-[350px] h-[128px] bg-[#F2F2F2] rounded-md flex-row">
        {/* Dish image */}
        <Image
          source={require("../../assets/images/mixed_rice_pic.png")}
          className="w-[128px] h-[128px] rounded-l-md"
          resizeMode="cover"
        />

        {/* Dish details */}
        <View className="flex-1 p-4 justify-center">
          {/* Dish name */}
          <Text className="font-psemibold text-[18px] text-[#1E1F1F]">
            Mixed Rice
          </Text>

          {/* Store name */}
          <Text className="font-pregular text-[14px] text-gray-500 mt-1">
            Asian Delights
          </Text>

          {/* Price */}
          <Text className="font-pbold text-[16px] text-green mt-2">
            RM 10.50
          </Text>
        </View>
      </View>

      {/* Recommended dish card - Egg Salad */}
      <View className="absolute top-[639px] left-[19px] w-[350px] h-[128px] bg-[#F2F2F2] rounded-md flex-row">
        {/* Dish image */}
        <Image
          source={require("../../assets/images/egg_salad_pic.png")}
          className="w-[128px] h-[128px] rounded-l-md"
          resizeMode="cover"
        />

        {/* Dish details */}
        <View className="flex-1 p-4 justify-center">
          {/* Dish name */}
          <Text className="font-psemibold text-[18px] text-[#1E1F1F]">
            Egg Salad
          </Text>

          {/* Store name */}
          <Text className="font-pregular text-[14px] text-gray-500 mt-1">
            Fresh & Green
          </Text>

          {/* Price */}
          <Text className="font-pbold text-[16px] text-green mt-2">
            RM 8.90
          </Text>
        </View>
      </View>
    </View>
  );
}
